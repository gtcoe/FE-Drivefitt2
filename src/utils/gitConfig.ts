import { simpleGit, SimpleGit } from "simple-git";

export const initializeGit = async (): Promise<SimpleGit> => {
  // Configure authentication for push
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USER_NAME;
  const email = process.env.GITHUB_USER_EMAIL;

  if (!token || !username || !email) {
    throw new Error("GitHub credentials not found in environment variables");
  }

  // Initialize git with user config
  const git = simpleGit({
    config: [`user.name=${username}`, `user.email=${email}`],
  });

  // The repository URL (hardcoded since we know it)
  const repoUrl = "aasthapandey/FE-DriveFitt";

  try {
    // Set up the remote with authentication
    const remoteUrl = `https://${token}@github.com/${repoUrl}.git`;

    // Force set the origin remote
    try {
      await git.removeRemote("origin");
    } catch (e) {
      console.log("Remote doesn't exist", e);
      // Ignore error if remote doesn't exist
    }

    await git.addRemote("origin", remoteUrl);

    // Ensure we're on the main branch
    try {
      await git.checkout("main");
    } catch (e) {
      console.log("Main branch doesn't exist", e);
      // If main branch doesn't exist, create it
      await git.checkoutLocalBranch("main");
    }

    return git;
  } catch (error) {
    console.error("Git configuration error:", error);
    throw error;
  }
};
