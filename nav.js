"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

async function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  const storyList = await StoryList.getStories();
  putStoriesOnPage(storyList.stories);
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function showForm(evt) {
  evt.preventDefault();
  $submitForm.show();
}

/*======= Submit Story on Nav Bar =======*/
async function submitStoryOnNav(evt) {
  console.debug("submitStoryOnNav", evt);
  hidePageComponents();
  $allStoriesList.show();

  let title = $("#create-title").val();
  let author = $("#create-author").val();
  let url = $("#create-url").val();

  // wrapper to handle the api functionality
  await storyList.addStory(currentUser, {
    title,
    author,
    url,
  });

  // erases submit form upon sending
  $submitForm.trigger("reset");
}

$navSubmitStory.on("click", showForm);
// $submitStory.on("submit", submitStoryOnNav);
