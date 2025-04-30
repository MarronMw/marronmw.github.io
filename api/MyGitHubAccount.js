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
      <div class="text-center p-6 bg-white rounded-xl shadow-lg">
        <p class="text-red-500 font-bold text-lg">
          Failed to load GitHub profile. Please check your internet connection or try again later.
        </p>
      </div>
    `;
  }
}

async function renderGitHubRepositories(username) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&direction=desc`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.status}`);
    }

    const repos = await response.json();
    const container = document.getElementById("projects-container");

    if (repos.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">No public repositories found</h3>
          <p class="mt-1 text-gray-500">This user doesn't have any public repositories yet.</p>
        </div>
      `;
      return;
    }

    // Clear previous content
    container.innerHTML = "";

    // Process repositories
    for (const repo of repos.filter((repod) => repod.stargazers_count > 0)) {
      const card = document.createElement("div");
      card.className =
        "group relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1";

      // Determine language color
      const langColor = repo.language
        ? getLanguageColor(repo.language)
        : "bg-gray-500";

      // Try to get social preview image (GitHub's OpenGraph image)
      let previewImage = null;
      try {
        // GitHub's OpenGraph image URL pattern
        const ogImageUrl = `https://opengraph.githubassets.com/${new Date().getTime()}/${
          repo.full_name
        }`;

        // Test if the image exists
        const imgTest = await fetch(ogImageUrl, { method: "HEAD" });
        if (imgTest.ok) {
          previewImage = ogImageUrl;
        }
      } catch (e) {
        console.log(`No preview image for ${repo.name}`);
      }

      card.innerHTML = `
        <div class="h-48 bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center overflow-hidden">
          ${
            previewImage
              ? `<img src="${previewImage}" alt="${repo.name} preview" class="w-full h-full object-cover" loading="lazy" />`
              : `
                <svg class="w-16 h-16 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              `
          }
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-2">${repo.name}</h3>
          <p class="text-gray-600 mb-4">${
            repo.description || "No description provided."
          }</p>
          
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex flex-wrap gap-2">
              ${
                repo.language
                  ? `
                <span class="flex items-center px-3 py-1 ${langColor} text-white text-xs font-medium rounded-full">
                  <span class="w-2 h-2 rounded-full bg-white mr-2"></span>
                  ${repo.language}
                </span>
              `
                  : ""
              }
              
              <span class="flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"></path>
                </svg>
                ${repo.forks_count}
              </span>
              
              <span class="flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                ${repo.stargazers_count}
              </span>
            </div>
            
            <a href="${
              repo.html_url
            }" target="_blank" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-sm transition-all duration-200">
              View Code
              <svg class="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </a>
          </div>
        </div>
      `;
      container.appendChild(card);
    }
  } catch (error) {
    console.error("Error loading repositories:", error);
    document.getElementById("projects-container").innerHTML = `
      <div class="col-span-full text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Unable to load repositories</h3>
        <p class="mt-1 text-gray-500">Please check your internet connection or try again later.</p>
      </div>
    `;
  }
}

// Helper function to get language colors (simplified version)
function getLanguageColor(language) {
  const colors = {
    JavaScript: "bg-yellow-400",
    TypeScript: "bg-blue-600",
    Python: "bg-blue-400",
    Java: "bg-red-600",
    "C#": "bg-purple-600",
    "C++": "bg-pink-600",
    Ruby: "bg-red-500",
    PHP: "bg-purple-400",
    Go: "bg-cyan-500",
    Swift: "bg-orange-500",
    Kotlin: "bg-purple-500",
    Rust: "bg-orange-700",
    HTML: "bg-orange-600",
    CSS: "bg-blue-500",
    SCSS: "bg-pink-500",
    Shell: "bg-gray-500",
    Dart: "bg-blue-400",
    Vue: "bg-green-500",
    React: "bg-blue-400",
    Angular: "bg-red-500",
  };

  return colors[language] || "bg-gray-500";
}

renderGitHubProfile(myUserName);
