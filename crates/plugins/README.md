# Rust-Accelerated ContextForge Plugins

High-performance Rust implementations of compute-intensive ContextForge plugins, built with PyO3 for seamless Python integration.

## 🚀 Performance

Rust plugins deliver 5-10x speedup over Python implementations for compute-intensive operations.

## 📁 Structure

Each plugin is fully independent with its own directory:

```
crates/plugins/
├── pii_filter/               # PII detection and masking
│   ├── Cargo.toml
│   ├── pyproject.toml
│   ├── Makefile
│   └── src/
├── secrets_detection/        # Secret scanning
│   ├── Cargo.toml
│   ├── Makefile
│   └── src/
└── encoded_exfil_detection/  # Encoded exfiltration detection
    ├── Cargo.toml
    └── src/
```

## 📦 Installation

```bash
# Install Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Build all maturin crates in the workspace (from repo root; includes crates/plugins, crates/tools, crates/mcpgateway, etc.)
make rust-install

# Or build a specific plugin
cd crates/plugins/pii_filter && maturin develop --release
```

## 🔧 Development

```bash
# Per-plugin commands (run from plugin directory, e.g. crates/plugins/pii_filter)
maturin develop --release   # Install plugin
cargo test                  # Run tests
cargo bench                 # Run benchmarks
cargo fmt                   # Format code
cargo clippy                # Lint

# All maturin crates (from repo root)
make rust-test              # Test workspace
make rust-format            # Format all
make rust-lint              # Lint all
```

## 🧪 Verification

```bash
# Verify installation
python -c "from pii_filter_rust.pii_filter_rust import PIIDetectorRust; print('OK')"

# Security audit (from repo root)
make rust-audit
# Or: cd crates/plugins/pii_filter && cargo audit
```

Rust plugins auto-activate with graceful Python fallback. Start gateway normally with `make dev` or `make serve`.

## 📚 Resources

- Plugin-specific docs: `crates/plugins/[plugin_name]/README.md`
- Full docs: `docs/docs/using/plugins/rust-plugins.md`

## 🤝 Contributing

```bash
cargo fmt && cargo clippy && cargo test  # Before committing
```

## 📝 License

Apache License 2.0 - See [LICENSE](../LICENSE)
