fn main() {
    // Try to find Python library with pkg-config
    if pkg_config::Config::new()
        .atleast_version("3.8")
        .probe("python3")
        .is_err()
    {
        // Fallback: Manually link Python library
        println!("cargo:rustc-link-lib=python3.12"); // Adjust to your Python version
        println!("cargo:rustc-link-search=native=/usr/lib"); // Adjust path if needed
    }
}