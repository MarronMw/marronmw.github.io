const myUserName = "MarronMw";

async function renderGitHubProfile(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  const data = await response.json();

  const aboutSection = document.getElementById("about");
  aboutSection.innerHTML = `
      <img src="${data.avatar_url}" alt="${username}'s avatar">
      <h2>@${data.login}</h2>
      <p><strong>GitHub URL:</strong> <a href="${
        data.html_url
      }" target="_blank">${data.html_url}</a></p>
      <p><strong>Followers:</strong> ${data.followers}</p>
      <p><strong>Following:</strong> ${data.following}</p>
      <p><strong>Public Repos:</strong> ${data.public_repos}</p>
      <p><strong>Joined:</strong> ${new Date(
        data.created_at
      ).toDateString()}</p>
    `;
}

renderGitHubProfile(myUserName);
