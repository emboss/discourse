import { acceptance } from "helpers/qunit-helpers";

acceptance("User", { loggedIn: true });

QUnit.test("Invites", async assert => {
  await visit("/u/eviltrout/invited/pending");
  assert.ok($("body.user-invites-page").length, "has the body class");
});

QUnit.test("Messages", async assert => {
  await visit("/u/eviltrout/messages");
  assert.ok($("body.user-messages-page").length, "has the body class");
});

QUnit.test("Notifications", async assert => {
  await visit("/u/eviltrout/notifications");
  assert.ok($("body.user-notifications-page").length, "has the body class");
});

QUnit.test("Root URL - Viewing Self", async assert => {
  await visit("/u/eviltrout");
  assert.ok($("body.user-activity-page").length, "has the body class");
  assert.equal(
    currentPath(),
    "user.userActivity.index",
    "it defaults to activity"
  );
  assert.ok(exists(".container.viewing-self"), "has the viewing-self class");
});

QUnit.test("Viewing Summary", async assert => {
  await visit("/u/eviltrout/summary");
  assert.ok(exists(".replies-section li a"), "replies");
  assert.ok(exists(".topics-section li a"), "topics");
  assert.ok(exists(".links-section li a"), "links");
  assert.ok(exists(".replied-section .user-info"), "liked by");
  assert.ok(exists(".liked-by-section .user-info"), "liked by");
  assert.ok(exists(".liked-section .user-info"), "liked");
  assert.ok(exists(".badges-section .badge-card"), "badges");
  assert.ok(exists(".top-categories-section .category-link"), "top categories");
});

QUnit.test("Viewing Drafts", async assert => {
  // prettier-ignore
  server.get("/draft.json", () => { // eslint-disable-line no-undef
    return [ 200, { "Content-Type": "application/json" }, {
      draft: "{\"reply\":\"This is a draft of the first post\",\"action\":\"reply\",\"categoryId\":1,\"archetypeId\":\"regular\",\"metaData\":null,\"composerTime\":2863,\"typingTime\":200}",
      draft_sequence: 42
    } ];
  });

  await visit("/u/eviltrout/activity/drafts");
  assert.ok(exists(".user-stream"), "has drafts stream");
  assert.ok(
    exists(".user-stream .user-stream-item-draft-actions"),
    "has draft action buttons"
  );

  await click(".user-stream button.resume-draft:eq(0)");
  assert.ok(
    exists(".d-editor-input"),
    "composer is visible after resuming a draft"
  );
});
