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

    // Render projects
    renderGitHubRepositories(username);
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

async function renderGitHubRepositories(username) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.status}`);
    }

    const repos = await response.json();
    const container = document.getElementById("projects-container");

    if (repos.length === 0) {
      container.innerHTML = "<p>No public repositories found.</p>";
      return;
    }

    repos.forEach((repo) => {
      const card = document.createElement("div");
      card.className =
        "bg-white rounded-xl shadow-lg p-5 hover:shadow-2xl transition duration-300";
      card.innerHTML = `
        <h3 class="text-lg font-semibold text-[#18bef0] mb-2">${repo.name}</h3>
        <p class="text-gray-600 mb-2">${
          repo.description || "No description provided."
        }</p>
        <p class="text-sm text-gray-500 mb-2">⭐ Stars: ${
          repo.stargazers_count
        } | 🍴 Forks: ${repo.forks_count}</p>
        <a href="${
          repo.html_url
        }" target="_blank" class="inline-block mt-2 text-sm font-medium text-white bg-[#18bef0] hover:bg-[#0ea5e9] px-4 py-2 rounded">
          View on GitHub
        </a>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading repositories:", error);
    document.getElementById("projects-container").innerHTML = `
      <p class="text-red-500 font-bold">Unable to load repositories at this time.</p>
    `;
  }
}

renderGitHubProfile(myUserName);
