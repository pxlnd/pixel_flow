# QuitScreenTransfer

Переносимый UI экрана потери жизни (`QUIT LEVEL?`), который в исходном проекте открывается по кнопке `back`.

## Что внутри

- `quit-screen.js` - standalone-компонент `QuitScreen`
- `quit-screen.css` - стили 1-в-1 по размерам/отступам/цветам
- `assets/heart_broken.png`
- `assets/btn_close.png`
- `assets/Fredoka-Medium.ttf`
- `demo.html` - быстрый локальный пример

## Подключение

```html
<link rel="stylesheet" href="QuitScreenTransfer/quit-screen.css">
<script src="QuitScreenTransfer/quit-screen.js"></script>
<script>
  var quitScreen = new QuitScreen({
    onQuit: function(state) {
      // Подтверждение выхода
      window.location = 'uniwebview://close?coins=' + state.coinsCount + '&hearts=' + state.heartsCount;
    },
    onClose: function() {
      // Отмена
    }
  });

  quitScreen.setCoins(120);
  quitScreen.setHearts(4);
  quitScreen.bindBackButton('#back-btn');
</script>
```

## Важные детали для совпадения верстки

- Шрифт `Fedoka` загружается из `assets/Fredoka-Medium.ttf`.
- Если путь к ассетам другой, передайте `assetBasePath` в конструктор:

```js
new QuitScreen({
  assetBasePath: '/path/to/your/assets'
});
```
