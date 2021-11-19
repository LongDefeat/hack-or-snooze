"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage(storyList.stories);
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, isDisplayOwnStories) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  let trashHTML = "";
  let favoriteHTML = "";

  if (currentUser) {
    if (isDisplayOwnStories) {
      trashHTML = `
        <span class="trash-can">
          <i class="fas fa-trash-alt"></i>
        </span>
      `;
    }

    const currentStoryIsFavorited = currentUser.favorites.filter((favStory) => {
      return favStory.storyId === story.storyId;
    });
    // if favorited, switch between classes for far and fas; use .length because filter returns an array
    favoriteHTML = `
      <span class="star">
        <i class="${
          currentStoryIsFavorited.length ? "fas" : "far"
        } fa-star"></i>
      </span>
    `;
  }

  return $(`
      <li id="${story.storyId}">
        ${trashHTML}
        ${favoriteHTML}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

//isDisplayOwnStories = boolean to display own stories so we can add UI to a story if it IS our own stories
function putStoriesOnPage(stories, isDisplayOwnStories) {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of stories) {
    const $story = generateStoryMarkup(story, isDisplayOwnStories);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitNewStoryOnForm(e) {
  e.preventDefault();
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username;
  const storyData = { title, url, author, username };

  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitForm.slideUp("slow"); // hides form
  $submitForm.trigger("reset"); // resets the form
}

$submitForm.on("submit", submitStoryOnNav);

/* My stories */
// evt listener to listen for a click on my stories1
$(document).on("click", "#nav-my-stories", (e) => {
  e.preventDefault();
  putStoriesOnPage(currentUser.ownStories, true);
});
// removing my stories on trash can
$(document).on("click", ".trash-can", async (e) => {
  e.preventDefault();

  let $target = $(e.target),
    $parentListItem = $target.parents("li"),
    storyId = $parentListItem.attr("id");

  await storyList.removeStory(currentUser, storyId);

  putStoriesOnPage(currentUser.ownStories, true);
});

/* Favorite Nav Bar */
$(document).on("click", "#nav-favorites", (e) => {
  e.preventDefault();
  putStoriesOnPage(currentUser.favorites);
});
