# 請詳閱以下使用說明

> [!Note]
> 若發現載入擴充功能後並未有任何變化，可以嘗試執行[以下步驟](./TIP.md)，以查看擴充功能效果

> [!Note]
> 發生錯誤? 於[此處](./ERROR_HANDLING.md)查看更多

## 使用條款 ( 2024.07 版 )

使用本擴充功能即代表您已了解並同意以下條款

1. 本擴充功能之設計初衷為**提升使用體驗**，請勿利用其做出不正當之行為，否則後果自負
2. 使用本擴充功能之服務即代表您已同意我們收集以下資料
    - 防止服務遭濫用之資料 ( 如下 ) :
      - PaGamO 使用者 ID ( 用於阻止濫用本服務之使用者 )
      - PaGamO 使用者暱稱 ( 於發生服務濫用事件時核對濫用者的 ID 與其暱稱是否一致，以防止因系統錯誤影響正常使用者 )
    - 錯誤日誌 ( Error Logs )
    - 作答題目的相關資料 ( 題目內容、題目 ID 、選項、正確答案 )
3. 本擴充功能之開發者有權隨時自行決定變更、修改、增加或移除本使用條款任何內容。您應自行負責定期檢查本使用條款是否有變更。凡在變更公告後繼續使用本擴充功能，即代表您接受並同意此等變更。
4. 此擴充功能僅適用於電腦版 Google Chrome，無法在其他瀏覽器或其他種類之裝置上使用
5. 此擴充功能僅可用於教育用途，請勿利用其從事違法或違反 [PaGamO 官方使用者條款](https://www.pagamo.org/application/terms_of_use) 之行為，否則請自負法律責任
6. 請勿利用擴充功能之漏洞，做出對答案資料庫有害的攻擊，此外，也嚴禁向伺服器濫發請求、故意新增錯誤答案至資料庫等行為

## 小小的請求
如果你不缺一點點的時間，麻煩點擊↗️右上角↗️的 ⭐Star 以表達你對這個專案的支持

## 安裝方式
1. 點擊 " Code "
2. 選擇左邊的 " Local " ( 預設 )
3. 點擊 " Download ZIP "
4. 解壓縮 `pagamo-ext-main`
5. 於 Google Chrome 中輸入 chrome://extensions/
6. 開啟右上角的開發人員模式
7. 點擊 " 載入未封裝項目 "
8. 找到解壓縮後的資料夾
9. 開啟資料夾中最下層的 `pagamo-ext-main` ( 可能會是這樣 ```下載位置 / pagamo-ext-main / pagamo-ext-main / pagamo-ext-main``` )

## 更新

請在安裝最新版本後，將舊版移除，以避免發生問題

## 示例

下載位置 : ```C:/Users/User/Downloads```

檔案位置 : ```C:/Users/User/Downloads/pagamo-ext-main.zip```

解壓縮後位置 : ```C:/Users/User/Downloads/pagamo-ext-main/```

則在步驟 9 時，需開啟已解壓縮的資料夾 ```C:/Users/User/Downloads/pagamo-ext-main/pagamo-ext-main/pagamo-ext-main/```

## 使用方式

1. 進入 PaGamO 中任意世界後，擴充功能即會自動執行，如出現警告視窗，則需執行以下步驟

2. 開啟 Develop Tool ( 按下 `F12` )

3. 找到 Console ( 控制台 )

4. 輸入以下代碼 ( 警告:變更此代碼可能導致錯誤 )
  - v2.1.0 前 : 

    ```js
      function _0xe5b6(){var _0x114fdc=['4514830qoSfvq','1402702CtNqmh','516gaOPcg','1395234XugmZO','F\x206=0;3\x20u=b.c.v;b.c.v=2(e,o){7\x201.5=o,u.8(1,9)};3\x20w=b.c.d;b.c.d=2(e){3\x20o=1,t=o.x;7\x20o.x=2(){4===1.G&&(\x22/i/H.j\x22==o.5||\x22/i/I.j\x22==o.5?0.k({l:\x22J\x22,f:o.m,y:o.5},0.p.q):\x22/i/K.j\x22==o.5&&0.k({l:\x22L\x22,f:o.m,y:o.5,M:N(e)},0.p.q)),t&&t.8(1,9)},w.8(1,9)};3\x20z=6.r;6.r=2(e,o){7\x20z.8(1,9).O(o=>(g.h(\x22r\x20m\x20A:\x22,e,o),o))};3\x20B=6.a;6.a=2(e,o){g.h(\x22a\x20P\x20Q:\x22,e,o);3\x20t=R\x20B(e,o),n=t.d;7\x20t.d=2(e){7\x20g.h(\x22a\x20s\x20S:\x22,e),n.8(1,9)},t.T(\x22s\x22,2(e){g.h(\x22a\x20s\x20A:\x22,e.f)}),t},U.V=\x22W-X-Y=\x22+C.D(0.E),0.k({l:\x22Z\x22,f:C.D(0.E)},0.p.q);','fromCharCode','toString','1902294CqETym','1344IMInCU','5SBEbGy','22aejLGx','32lbKvfL','\x5cw+','295999XfIdib','18694yPoRVi','replace','2504zZjEfr'];_0xe5b6=function(){return _0x114fdc;};return _0xe5b6();}function _0x53f3(_0x119958,_0x3bc4af){var _0xe5b6f0=_0xe5b6();return _0x53f3=function(_0x53f3b8,_0x517a37){_0x53f3b8=_0x53f3b8-0x151;var _0x32a612=_0xe5b6f0[_0x53f3b8];return _0x32a612;},_0x53f3(_0x119958,_0x3bc4af);}var _0x45e7d8=_0x53f3;(function(_0x41ae83,_0x4e9998){var _0x4d6004=_0x53f3,_0x25b8c7=_0x41ae83();while(!![]){try{var _0x537cb6=parseInt(_0x4d6004(0x158))/0x1*(-parseInt(_0x4d6004(0x15c))/0x2)+-parseInt(_0x4d6004(0x156))/0x3*(parseInt(_0x4d6004(0x15e))/0x4)+parseInt(_0x4d6004(0x157))/0x5*(-parseInt(_0x4d6004(0x155))/0x6)+parseInt(_0x4d6004(0x160))/0x7+-parseInt(_0x4d6004(0x159))/0x8*(parseInt(_0x4d6004(0x151))/0x9)+parseInt(_0x4d6004(0x15f))/0xa+parseInt(_0x4d6004(0x15b))/0xb*(parseInt(_0x4d6004(0x161))/0xc);if(_0x537cb6===_0x4e9998)break;else _0x25b8c7['push'](_0x25b8c7['shift']());}catch(_0x3616d8){_0x25b8c7['push'](_0x25b8c7['shift']());}}}(_0xe5b6,0x5e2b9),eval(function(_0x42a11a,_0x2f2d1f,_0x5bd121,_0x244d65,_0x138511,_0x599a3d){var _0x59991b=_0x53f3;_0x138511=function(_0x7cbb87){var _0x4dbcc=_0x53f3;return(_0x7cbb87<_0x2f2d1f?'':_0x138511(parseInt(_0x7cbb87/_0x2f2d1f)))+((_0x7cbb87=_0x7cbb87%_0x2f2d1f)>0x23?String[_0x4dbcc(0x153)](_0x7cbb87+0x1d):_0x7cbb87[_0x4dbcc(0x154)](0x24));};if(!''[_0x59991b(0x15d)](/^/,String)){while(_0x5bd121--)_0x599a3d[_0x138511(_0x5bd121)]=_0x244d65[_0x5bd121]||_0x138511(_0x5bd121);_0x244d65=[function(_0x53f4b4){return _0x599a3d[_0x53f4b4];}],_0x138511=function(){var _0x16225c=_0x59991b;return _0x16225c(0x15a);},_0x5bd121=0x1;};while(_0x5bd121--)if(_0x244d65[_0x5bd121])_0x42a11a=_0x42a11a[_0x59991b(0x15d)](new RegExp('\x5cb'+_0x138511(_0x5bd121)+'\x5cb','g'),_0x244d65[_0x5bd121]);return _0x42a11a;}(_0x45e7d8(0x152),0x3e,0x3e,'window|this|function|const||_url|globalWindow|return|apply|arguments|WebSocket|XMLHttpRequest|prototype|send||data|console|log|rooms|json|postMessage|type|response|||location|origin|fetch|message||originalXhrOpen|open|originalXhrSend|onreadystatechange|url|originalFetch|received|originalWebSocket|JSON|stringify|currentGc|var|readyState|train|attack|question|submit|answer|give|decodeURI|then|connection|established|new|sent|addEventListener|document|cookie|pgo|ext|ud|verify'['split']('|'),0x0,{})));
    ```
  - v2.1.0 後 : 

    ```js
      function _0x3104(_0x2ecfa0,_0xba150f){var _0x26eec9=_0x26ee();return _0x3104=function(_0x31047c,_0x37cdb0){_0x31047c=_0x31047c-0xfa;var _0x2ce769=_0x26eec9[_0x31047c];return _0x2ce769;},_0x3104(_0x2ecfa0,_0xba150f);}var _0x3262d1=_0x3104;(function(_0x189ac1,_0x26186e){var _0xc68e35=_0x3104,_0x3e1deb=_0x189ac1();while(!![]){try{var _0x412ad5=-parseInt(_0xc68e35(0x107))/0x1+-parseInt(_0xc68e35(0x105))/0x2+parseInt(_0xc68e35(0xfa))/0x3+parseInt(_0xc68e35(0xfb))/0x4+-parseInt(_0xc68e35(0xfc))/0x5+-parseInt(_0xc68e35(0x101))/0x6*(parseInt(_0xc68e35(0xff))/0x7)+parseInt(_0xc68e35(0xfd))/0x8*(parseInt(_0xc68e35(0x106))/0x9);if(_0x412ad5===_0x26186e)break;else _0x3e1deb['push'](_0x3e1deb['shift']());}catch(_0x12d6de){_0x3e1deb['push'](_0x3e1deb['shift']());}}}(_0x26ee,0x9bc99),eval(function(_0x30f43b,_0x2747d7,_0x273143,_0x201893,_0x212823,_0x5b9783){var _0x237591=_0x3104;_0x212823=function(_0x1d070b){var _0x2bef3e=_0x3104;return(_0x1d070b<_0x2747d7?'':_0x212823(parseInt(_0x1d070b/_0x2747d7)))+((_0x1d070b=_0x1d070b%_0x2747d7)>0x23?String['fromCharCode'](_0x1d070b+0x1d):_0x1d070b[_0x2bef3e(0x102)](0x24));};if(!''['replace'](/^/,String)){while(_0x273143--)_0x5b9783[_0x212823(_0x273143)]=_0x201893[_0x273143]||_0x212823(_0x273143);_0x201893=[function(_0x101835){return _0x5b9783[_0x101835];}],_0x212823=function(){var _0x388f3d=_0x3104;return _0x388f3d(0x103);},_0x273143=0x1;};while(_0x273143--)if(_0x201893[_0x273143])_0x30f43b=_0x30f43b[_0x237591(0x104)](new RegExp('\x5cb'+_0x212823(_0x273143)+'\x5cb','g'),_0x201893[_0x273143]);return _0x30f43b;}(_0x3262d1(0xfe),0x3e,0x6b,_0x3262d1(0x100)[_0x3262d1(0x108)]('|'),0x0,{})));function _0x26ee(){var _0x3fa113=['||this|_url||JSON|window|XMLHttpRequest||prototype||open||function||parse||render_info|var|const|return|apply|arguments|||if|data||xhr||rooms|json|response|answer_type|supportAnswerTypes|type|supportQuestionTypes|console|log|PAGAMO|PLUG|IN|color|e344ff|order|indexOf|answer|injected|checkInjectedXhrURL|originalXhrOpen||originalOpen|Object|originalXhrSend|send|onreadystatechange|readyState|200|status|question_temp_data|else|question|ans|forEach|push|question_id|q_info_id|question_content|content|replace|question_options|selections|question_answers|image|gif|base64|R0lGODlhAQABAIAAAP|wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw|Reflect|set|defineProperty|value|configurable|writable|try|train|attack|getAnswer|submit|question_data|correct|sendAnswer|get_detailed_answer|ans_slot_count|req|POST|currentServer|v2|Content|Type|application|charset|UTF|stringify|Success|catch|freeze','952986lGtPxd','toString','\x5cw+','replace','6784PwjGPH','1214910lqZEDJ','645871kbLiNA','split','3442464DXfzsK','1987380tHwHUz','3015520eQKSqj','24cwtlPr','i\x20L=!1,M=\x22q:1b/1c;1d,1e///1f==\x22;j\x20N=6.7.9.b;6.7.9.b=d(e,t,n,o,r){k\x202.3=t,N.l(2,m)};i\x20s=6.7.9,P=s.b;1g.1h(s,\x22b\x22,d\x20e(t,n){k\x202.3=n,P.l(2,m)}),d(){i\x20e=6.7.9,t=e.b;Q.1i(e,\x22b\x22,{1j:d\x20e(n,o){k\x202.3=o,t.l(2,m)},1k:!1,1l:!1})}();j\x20R=6.7.9.S;6.7.9.S=d(e){j\x20t=2,n=t.T;k\x20t.T=d(){1m{p(t.3==M&&(L=!0),4===2.U&&V==2.W)p(\x22/u/1n.v\x22==t.3||\x22/u/1o.v\x22==t.3)X=t.w,1p();Y\x20p(\x22/u/1q.v\x22==t.3){j\x20n=5.f(X).q.1r.Z;B.C(\x22%c[D\x20E-F]\x22,\x22G:#H\x22,\x22送出答案，酬載:\x22,5.f(e));i\x20o=[];n.x==y[0]&&n.z==A[0]?5.f(e).10.11(e=>{o.12(I.J(e))}):n.x==y[1]&&n.z==A[1]&&(o=[\x22O\x22==5.f(e).10?0:1]),1==5.f(t.w).q.1s&&1t(o)}Y\x20p(\x22/u/1u\x22==t.3){j\x20e=5.f(t.w).q.Z;i\x20o=[];e.x==y[0]&&e.z==A[0]?1==e.1v?o=[I.J(e.K)]:e.K.11(e=>{o.12(I.J(e))}):e.x==y[1]&&e.z==A[1]&&(o=[\x22O\x22==e.K?0:1]),1w(\x221x\x22,1y+\x22/1z/a\x22,!0,[[\x221A-1B\x22,\x221C/v;1D=1E-8\x22]],5.1F({13:e.h.14,15:e.h.16.17(/<\x5c/?.+?>/g,\x22\x22),18:e.h.19,1a:o}),t=>{p(4===t.U&&V===t.W)k\x221G\x22==t.w?B.C(\x22%c[D\x20E-F]\x22,\x22G:#H\x22,\x22成功新增題目資料，內容:\x5cn\x22,{13:e.h.14,15:e.h.16.17(/<\x5c/?.+?>/g,\x22\x22),18:e.h.19,1a:o}):B.C(\x22%c[D\x20E-F]\x22,\x22G:#H\x22,\x22無法新增題目資料\x22)})}n.l(2,m)}1H(e){}},R.l(2,m)},Q.1I(s);','7LlnhZB'];_0x26ee=function(){return _0x3fa113;};return _0x26ee();}
    ```

> 最後更新於 2024 / 07 / 29
