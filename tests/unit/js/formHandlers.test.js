/**
 * Unit tests for formHandlers.js module
 * Tests: handleToggleSubmit, handleSubmitWithConfirmation, handleDeleteSubmit
 */

import { describe, test, expect, vi, afterEach } from "vitest";

import {
  handleToggleSubmit,
  handleSubmitWithConfirmation,
  handleDeleteSubmit,
} from "../../../mcpgateway/admin_ui/formHandlers.js";

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// handleToggleSubmit
// ---------------------------------------------------------------------------
describe("handleToggleSubmit", () => {
  test("prevents default, appends hidden field, and submits form", () => {
    // Make isInactiveChecked("tools") return true via DOM
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = "show-inactive-tools";
    cb.checked = true;
    document.body.appendChild(cb);

    document.body.insertAdjacentHTML("beforeend", '<form id="test-form"></form>');
    const form = document.getElementById("test-form");
    form.submit = vi.fn();

    const event = { preventDefault: vi.fn(), target: form };

    handleToggleSubmit(event, "tools");

    expect(event.preventDefault).toHaveBeenCalled();
    const hiddenField = form.querySelector('input[name="is_inactive_checked"]');
    expect(hiddenField).not.toBeNull();
    expect(hiddenField.value).toBe("true");
    expect(form.submit).toHaveBeenCalled();
  });

  test("appends false when checkbox is unchecked", () => {
    document.body.innerHTML = '<form id="test-form"></form>';
    const form = document.getElementById("test-form");
    form.submit = vi.fn();

    const event = { preventDefault: vi.fn(), target: form };

    handleToggleSubmit(event, "gateways");

    const hiddenField = form.querySelector('input[name="is_inactive_checked"]');
    expect(hiddenField.value).toBe("false");
  });
});

// ---------------------------------------------------------------------------
// handleSubmitWithConfirmation
// ---------------------------------------------------------------------------
describe("handleSubmitWithConfirmation", () => {
  test("shows confirmation dialog and submits on confirm", () => {
    document.body.innerHTML = '<form id="test-form"></form>';
    const form = document.getElementById("test-form");
    form.submit = vi.fn();

    const event = { preventDefault: vi.fn(), target: form };

    vi.spyOn(window, "confirm").mockReturnValue(true);

    handleSubmitWithConfirmation(event, "tool");

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining("permanently delete this tool")
    );
    expect(form.submit).toHaveBeenCalled();
  });

  test("does not submit when user cancels confirmation", () => {
    document.body.innerHTML = '<form id="test-form"></form>';
    const form = document.getElementById("test-form");
    form.submit = vi.fn();

    const event = { preventDefault: vi.fn(), target: form };

    vi.spyOn(window, "confirm").mockReturnValue(false);

    const result = handleSubmitWithConfirmation(event, "tool");

    expect(result).toBe(false);
    expect(form.submit).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// handleDeleteSubmit
// ---------------------------------------------------------------------------
describe("handleDeleteSubmit", () => {
  test("shows two confirmation dialogs and appends purge field on confirm", () => {
    document.body.innerHTML = '<form id="test-form"></form>';
    const form = document.getElementById("test-form");
    form.submit = vi.fn();

    const event = { preventDefault: vi.fn(), target: form };

    vi.spyOn(window, "confirm")
      .mockReturnValueOnce(true) // first confirm (delete)
      .mockReturnValueOnce(true); // second confirm (purge metrics)

    handleDeleteSubmit(event, "gateway", "test-gw");

    expect(window.confirm).toHaveBeenCalledTimes(2);
    const purgeField = form.querySelector('input[name="purge_metrics"]');
    expect(purgeField).not.toBeNull();
    expect(purgeField.value).toBe("true");
    expect(form.submit).toHaveBeenCalled();
  });

  test("uses name in confirmation message when provided", () => {
    document.body.innerHTML = '<form id="test-form"></form>';
    const form = document.getElementById("test-form");
    form.submit = vi.fn();

    const event = { preventDefault: vi.fn(), target: form };

    vi.spyOn(window, "confirm")
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    handleDeleteSubmit(event, "tool", "my-tool");

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining('tool "my-tool"')
    );
  });

  test("does not purge metrics when user declines second confirmation", () => {
    document.body.innerHTML = '<form id="test-form"></form>';
    const form = document.getElementById("test-form");
    form.submit = vi.fn();

    const event = { preventDefault: vi.fn(), target: form };

    vi.spyOn(window, "confirm")
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    handleDeleteSubmit(event, "server");

    const purgeField = form.querySelector('input[name="purge_metrics"]');
    expect(purgeField).toBeNull();
    expect(form.submit).toHaveBeenCalled();
  });

  test("returns false when user cancels first confirmation", () => {
    document.body.innerHTML = '<form id="test-form"></form>';
    const form = document.getElementById("test-form");
    form.submit = vi.fn();

    const event = { preventDefault: vi.fn(), target: form };

    vi.spyOn(window, "confirm").mockReturnValue(false);

    const result = handleDeleteSubmit(event, "resource");

    expect(result).toBe(false);
    expect(form.submit).not.toHaveBeenCalled();
  });

  test("appends team_id from URL when present", () => {
    const url = new URL(window.location.href);
    url.searchParams.set("team_id", "team-42");
    window.history.replaceState({}, "", url.toString());

    document.body.innerHTML = '<form id="test-form"></form>';
    const form = document.getElementById("test-form");
    form.submit = vi.fn();

    const event = { preventDefault: vi.fn(), target: form };

    vi.spyOn(window, "confirm")
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    handleDeleteSubmit(event, "tool", "t1");

    const teamField = form.querySelector('input[name="team_id"]');
    expect(teamField).not.toBeNull();
    expect(teamField.value).toBe("team-42");

    window.history.replaceState({}, "", window.location.pathname);
  });

  test("passes inactiveType to isInactiveChecked via hidden field value", () => {
    // Add checked checkbox for "custom-type" so isInactiveChecked("custom-type") returns true
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = "show-inactive-custom-type";
    cb.checked = true;
    document.body.appendChild(cb);

    document.body.insertAdjacentHTML("beforeend", '<form id="test-form"></form>');
    const form = document.getElementById("test-form");
    form.submit = vi.fn();

    const event = { preventDefault: vi.fn(), target: form };

    vi.spyOn(window, "confirm")
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    handleDeleteSubmit(event, "tool", "t1", "custom-type");

    const hiddenField = form.querySelector('input[name="is_inactive_checked"]');
    expect(hiddenField.value).toBe("true");
  });
});
