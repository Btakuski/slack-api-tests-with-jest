const request = require("supertest")("https://slack.com");
require("dotenv").config();

const slackToken = process.env.SLACK_TOKEN;
const channel = process.env.SLACK_CHANNEL;
const msgText = "Hello World!";
const postMessage = "/api/chat.postMessage";
const deleteMessage = "/api/chat.delete";
const updateMessage = "/api/chat.update";
const scheduleMessage = "/api/chat.scheduleMessage";

describe(`POST ${postMessage}`, () => {
  var response;

  beforeEach(async () => {
    response = await request
      .post(`${postMessage}`)
      .set("Authorization", `Bearer ${slackToken}`)
      .send({
        channel: `${channel}`,
        text: `${msgText}`,
        attachments: [
          {
            text: `${msgText}`,
            color: "FF3333",
          },
        ],
      });
  });

  it("posts message successfully", async () => {
    expect(response.body.ok).toBe(true);
    expect(response.body.error).toBeUndefined();
  });

  it("response text matches text provided", async () => {
    expect(response.body.message.text).toBe(`${msgText}`);
  });

  it("attachment text matches text provided", async () => {
    expect(response.body.message.attachments[0].text).toBe(`${msgText}`);
  });
});

describe(`POST ${postMessage}`, () => {
  var response;

  beforeEach(async () => {
    response = await request.post(`${postMessage}`).send({
      channel: `${channel}`,
      text: `${msgText}`,
    });
  });

  it("returns `not_authed` error when access token is missing", async () => {
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toBe("not_authed");
  });
});

describe(`POST ${postMessage}`, () => {
  var response;

  beforeEach(async () => {
    response = await request
      .post(`${postMessage}`)
      .set("Authorization", `Bearer ${slackToken}`)
      .send({
        channel: "sandbox",
        text: `${msgText}`,
      });
  });

  it("returns `channel_not_found` error when using an invalid channel", async () => {
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toBe("channel_not_found");
  });
});

describe(`POST ${postMessage}`, () => {
  var response;

  beforeEach(async () => {
    response = await request
      .post(`${postMessage}`)
      .set("Authorization", `Bearer ${slackToken}`)
      .send({
        channel: `${channel}`,
      });
  });

  it("returns `no_text` error when no text is provided", async () => {
    expect(response.body.error).toBe("no_text");
  });
});

describe(`POST ${deleteMessage}`, () => {
  var messageTimeStamp;
  var response;

  beforeEach(async () => {
    response = await request
      .post(`${postMessage}`)
      .set("Authorization", `Bearer ${slackToken}`)
      .send({
        channel: `${channel}`,
        text: `${msgText}`,
      });

    messageTimeStamp = response.body.ts;
  });

  it("deletes message successfully", async () => {
    response = await request
      .post(`${deleteMessage}`)
      .set("Authorization", `Bearer ${slackToken}`)
      .send({
        channel: `${channel}`,
        ts: messageTimeStamp,
      });

    expect(response.body.ok).toBe(true);
    expect(response.body.error).toBeUndefined();
  });
});

describe(`POST ${deleteMessage}`, () => {
  var response;

  beforeEach(async () => {
    response = await request
      .post(`${deleteMessage}`)
      .set("Authorization", `Bearer ${slackToken}`)
      .send({
        channel: `${channel}`,
        text: `${msgText}`,
        ts: "invalidTimestamp",
      });
  });

  it("returns `message_not_found` error when invalid timestamp is provided", async () => {
    expect(response.body.ok).toBe(false);
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toBe("message_not_found");
  });
});

describe(`POST ${updateMessage}`, () => {
  var messageTimeStamp;
  var response;

  beforeEach(async () => {
    messageTimeStamp = await request
      .post(`${postMessage}`)
      .set("Authorization", `Bearer ${slackToken}`)
      .send({
        channel: `${channel}`,
        text: `${msgText}`,
      });
  });

  it("returns `updatedText` when message updated successfully", async () => {
    response = await request
      .post(`${updateMessage}`)
      .set("Authorization", `Bearer ${slackToken}`)
      .send({
        channel: `${channel}`,
        text: `updatedText`,
        ts: messageTimeStamp.body.ts,
      });
    expect(response.body.ok).toBe(true);
    expect(response.body.error).toBeUndefined();
    expect(response.body.text).toBe("updatedText");
  });
});

describe(`POST ${scheduleMessage}`, () => {
  var response;

  beforeEach(async () => {
    response = await request
      .post(`${scheduleMessage}`)
      .set("Authorization", `Bearer ${slackToken}`)
      .send({
        channel: `${channel}`,
        text: `${msgText}`,
        post_at: 1627508417,
      });
  });

  it("returns `scheduled_message_id` when scheduled successfully", () => {
    expect(response.body.ok).toBe(true);
    expect(response.body.error).toBeUndefined();
    expect(response.body.scheduled_message_id).toBeDefined();
  });
});

describe(`POST ${scheduleMessage}`, () => {
  var response;

  beforeEach(async () => {
    response = await request
      .post(`${scheduleMessage}`)
      .set("Authorization", `Bearer ${slackToken}`)
      .send({
        channel: `${channel}`,
        text: `${msgText}`,
        post_at: 932679617,
      });
  });

  it("returns error `time_in_past` error when time in past is provided", () => {
    expect(response.body.ok).toBe(false);
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toBe("time_in_past");
  });
});
