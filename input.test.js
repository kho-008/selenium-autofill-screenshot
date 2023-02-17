const { Builder, By, Select } = require("selenium-webdriver");
const fs = require('fs');

let driver;

const consoleShowList = async (cssSelector, attribute) => {
  const list = []
  const elements = await driver.findElements(By.css(cssSelector));
  for(let ele of elements) {
    if (attribute) {
      list.push(await ele.getAttribute(attribute));
    } else {
      list.push(await ele.getText());
    }
  }
  console.log(list);
}

const inputList = {
  company_name: '会社名・団体名',
  department: '部署・組織名',
  name: 'お名前',
  furigana: 'フリガナ',
  mail: 'example@example.com',
  tel: '電話番号',
  postal_code: '郵便番号',
  city: '市区町村',
  address_01: '町名・番地',
  address_02: '建物等',
  contact_title: 'お問い合わせ件名',
  contact_message: 'お問い合わせ内容',
}

describe("入力フォーム", () => {
  // テスト開始前にドライバーを起動
  beforeAll(() => {
    driver = new Builder().forBrowser("chrome").build();
  });

  // テスト終了後にドライバーを終了
  // afterAll(() => driver.quit());

  test("項目へ入力", async () => {
    // テスト対象のページへアクセス
    await driver.get("http://localhost/contact/");

    const selectInquiryElement = await driver.findElement(By.name('inquiry_details'))
    const selectInquiry = new Select(selectInquiryElement)
    const selectPrefectureElement = await driver.findElement(By.name('prefecture'))
    const selectPrefecture = new Select(selectPrefectureElement)

    // consoleShowList('.form_content_headline');
    // consoleShowList('.form_wrap_inner input, .form_wrap_inner textarea', 'name')

    await selectInquiry.selectByValue('メールマガジン解約・アドレス変更について');
    await selectPrefecture.selectByValue('大阪府');

    Object.keys(inputList).forEach(async function (code) {
      await driver.findElement(By.name(code)).sendKeys(inputList[code]);
    });

    // await driver.findElement(By.name("submitConfirm")).click();
  }, 15000);

  test("スクリーンショット", async () => {
    const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions([
      '--headless',
      '--disable-gpu',
    ])
    .build();

    try {
      await driver.get('http://localhost/contact/');
      const base64 = await driver.takeScreenshot();
      const buffer = Buffer.from(base64, 'base64');
      fs.writeFileSync('screenshot.jpg', buffer);
    } catch (e) {
      console.log(e)
    } finally {
      await driver.quit();
    }
  }, 30000);
});