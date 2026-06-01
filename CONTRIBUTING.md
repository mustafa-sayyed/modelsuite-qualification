# Contribution and Qualification

Welcome! If you are participating in a qualification assessment or contributing to this repository, please follow the strict process outlined below to ensure a smooth evaluation.

## 1. Branch Naming & Assignment
Every candidate is assigned a unique branch name via email (in the format: `27-26-22-7-5-pranav-test`). 
**You must use this exact branch name** for your local work and remote pushing. Your Pull Request title must also be exactly this branch name.

## 2. Forking and Cloning the Repository
Since you are not added as a direct collaborator, you must fork the repository to your own GitHub account first. Click the "Fork" button on the top right of the main repository page.

Start by cloning your forked repository to your local machine and checking out your assigned branch:
```bash
git clone https://github.com/<your-username>/modelsuite-qualification.git
cd modelsuite-qualification
git checkout -b <your-assigned-branch-name>
```

## 3. Making Changes & Local Checks

> **Scope of Work:** You are strongly advised to focus exclusively on your assigned module or task. However, if modifying another module or component is strictly necessary to successfully complete your assignment, you are permitted to do so. Please clearly document any such cross-module changes in your Pull Request.

Before committing your code, please ensure it meets the project standards. Run the following checks locally:
- **Client**: `cd client && npm run lint && npm run build`
- **Server**: `cd server && npm run lint && npm run build`

## 4. Raising a Pull Request (PR)
When you are ready to submit your work:
1. Push your branch to your forked repository.
2. Open a Pull Request from your fork's branch against the upstream `master` branch.
3. **PR Title**: Ensure the title exactly matches your assigned branch name.
4. **PR Template**: Fill out the provided PR template thoroughly. This includes:
   - A brief summary of your changes.
   - Checking off the pre-flight checklists (local linting, builds, etc.).
   - A Voice recorded video of the overall changes and demonstration of your work.
   - Any other information you think is relevant for PR reviewers.


## 5. CI/CD Pipeline & Checks
We have an automated CI/CD pipeline that runs on every PR against `master`. It performs:
- **Danger Checks**: Automated PR review tasks.
- **Client & Server Checks**: Linting and building for both frontend and backend.

**⚠️ Important:** If your PR fails any of these checks (e.g., due to lint errors, build failures, or Danger failures), **the pipeline will automatically close your PR** and leave a comment with the failure logs. Please fix the issues locally before submitting.

## 6. Final Submission
Before the designated deadline, you must submit two things:
1. The **link to your Pull Request**.
2. A **Voice recorded video** explaining the overall changes you made and demonstrating your work.
