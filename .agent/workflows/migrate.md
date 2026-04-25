# Migration Workflow
Automates the lift-and-shift from Flutter/Dart to TypeScript.

1. **Analysis**: Read the corresponding `.dart` file in the Flutter project.
2. **Execution**: Generate the equivalent TypeScript/React code in the `src/` directory.
3. **Validation**: Run the linter and unit tests for the new component.
4. **Sync**: Call the `git-sync` skill to commit and push the progress.
5. **Update**: Mark the task as complete in `implementation_plan.md`.