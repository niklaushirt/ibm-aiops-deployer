module.exports = () => [
  {
    type: 'sessionStart',
    view: 'Products'
  },
  {
    type: 'httpRequest',
    timeOffset: [15, 30],
    correlation: 'list-products',
    url: 'https://rs-catalog/list-product',
    fake: {
      duration: [500, 1000],
      statusCode: 'auto'
    }
  },
  {
    type: 'customEvent',
    timeOffset: [1500, 3000],
    eventName: 'Product-Price-Filter',
    chance: 0.9,
    meta: {
      userPerformed: 'Customer filtering product by custum price input',
      userInputString: '۱۲۳٤.۳۳۱'
    }
  },
  {
    type: 'crash',
    timeOffset: [1000, 2000],
    view: 'Products',
    errMsg: 'java.lang.NumberFormatException (For input string: "۱۲۳٤.۳۳۱")',
    stackTrace:
      'java.lang.NumberFormatException: For input string: "۱۲۳٤.۳۳۱" \n  at jdk.internal.math.FloatingDecimal.readJavaFormatString(FloatingDecimal.java:2054) \n  at jdk.internal.math.FloatingDecimal.parseDouble(FloatingDecimal.java:110) \n  at java.lang.Double.parseDouble(Double.java:660) \n  at com.example.shop.products.screens.crash.GenerateCrash.onViewCreated$lambda$4$lambda$3(GenerateCrash.kt:52) \n  at com.example.shop.products.screens.crash.GenerateCrash.$r8$lambda$xFsfRsHHLU3dhf03pea9GMm1pSc(Unknown Source:0) \n  at com.example.shop.products.screens.crash.GenerateCrash$$ExternalSyntheticLambda3.onClick(Unknown Source:0) \n  at android.view.View.performClick(View.java:7659) \n  at com.google.android.material.button.MaterialButton.performClick(MaterialButton.java:1131) \n  at android.view.View.performClickInternal(View.java:7636) \n  at android.view.View.-$$Nest$mperformClickInternal(Unknown Source:0) \n  at android.view.View$PerformClick.run(View.java:30156) \n  at android.os.Handler.handleCallback(Handler.java:958) \n  at android.os.Handler.dispatchMessage(Handler.java:99) \n  at android.os.Looper.loopOnce(Looper.java:205) \n  at android.os.Looper.loop(Looper.java:294) \n  at android.app.ActivityThread.main(ActivityThread.java:8176) \n  at java.lang.reflect.Method.invoke(Native Method) \n  at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:552) \n  at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:971)'
  }
];
