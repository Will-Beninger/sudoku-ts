# Environment Guardrails (Windows/PowerShell)

1. **Non-Interactive Execution:** Always append `--yes`, `--force`, or `-y` to CLI commands (e.g., `npm init -y`).
2. **Path Handling:** Use forward slashes `/` or escaped backslashes `\\` in code, but strictly use `./` for local script execution in PowerShell.
3. **Execution Policy:** If you encounter a script execution error, run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process`.
4. **Credential Manager:** Do not attempt to input passwords. Use `gh auth status` to check if the user is logged in before attempting GitHub operations.