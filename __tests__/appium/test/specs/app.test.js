// https://www.chaijs.com/
import { expect } from "chai"; // Using Expect style.
import AppScreen from "../pageobjects/app.page";

// http://webdriver.io/api/protocol/timeoutsImplicitWait.html
browser.timeoutsImplicitWait(30000);

// This group represents the tests for the screen.
describe("App Tests", function() {
  context("when in App", () => {
    it("displays logo image", function() {
      // Wait until the screen is loaded and displayed.
      expect(AppScreen.react_image_node.getAttribute("isdisplayed")).to.be.true;
    });
  });
});
