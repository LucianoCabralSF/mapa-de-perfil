import test from 'node:test';
import assert from 'node:assert/strict';
import { navegadorInterno } from '../src/ambiente.js';

const UA = {
  chromeAndroid: 'Mozilla/5.0 (Linux; Android 14; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
  webviewAndroid: 'Mozilla/5.0 (Linux; Android 14; SM-A546B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/128.0.6613.127 Mobile Safari/537.36',
  whatsappAndroid: 'Mozilla/5.0 (Linux; Android 14; SM-A546B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/128.0 Mobile Safari/537.36 WhatsApp/2.24.19',
  safariIphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  instagramIphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0.0.0',
  facebookAndroid: 'Mozilla/5.0 (Linux; Android 14; wv) AppleWebKit/537.36 Chrome/128.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/480.0]',
  samsung: 'Mozilla/5.0 (Linux; Android 14; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36',
  desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
};

test('navegadores comuns nunca sao tratados como aplicativo', () => {
  for (const nome of ['chromeAndroid', 'safariIphone', 'samsung', 'desktop']) {
    assert.equal(navegadorInterno(UA[nome]), null, `${nome} classificado errado`);
  }
});

test('aplicativos conhecidos sao reconhecidos pelo nome', () => {
  assert.equal(navegadorInterno(UA.whatsappAndroid), 'WhatsApp');
  assert.equal(navegadorInterno(UA.instagramIphone), 'Instagram');
  assert.equal(navegadorInterno(UA.facebookAndroid), 'Facebook');
});

test('webview generico do android e reconhecido como aplicativo', () => {
  assert.equal(navegadorInterno(UA.webviewAndroid), 'aplicativo');
});

test('entrada vazia ou estranha nao quebra', () => {
  assert.equal(navegadorInterno(''), null);
  assert.equal(navegadorInterno(undefined), null);
});
