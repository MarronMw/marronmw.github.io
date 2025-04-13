const myUserName = "MarronMw";

async function renderGitHubProfile(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error(`GitHub user not found: ${response.status}`);
    }

    const data = await response.json();

    document.getElementById("github-avatar").src = data.avatar_url;
    document.getElementById("github-avatar").alt = `${username}'s avatar`;
    document.getElementById("github-username").textContent = `@${data.login}`;
    document.getElementById("github-link").textContent = data.html_url;
    document.getElementById("github-link").href = data.html_url;
    document.getElementById("github-followers").textContent = data.followers;
    document.getElementById("github-following").textContent = data.following;
    document.getElementById("github-repos").textContent = data.public_repos;
    document.getElementById("bio").textContent = data.bio;

    const joinDate = new Date(data.created_at);
    const formattedDate = joinDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    document.getElementById("github-joined").textContent = formattedDate;
  } catch (error) {
    console.error("Error fetching GitHub data:", error);

    const profileCard = document.querySelector(".github-profile-card");
    profileCard.innerHTML = `
      <p style="color: red; font-weight: bold;">
        Failed to load GitHub profile. Please check your internet connection or try again later.
      </p>
    `;
  }
}

renderGitHubProfile(myUserName);
