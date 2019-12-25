// ==UserScript==
// @name         下载谷歌翻译音频0
// @namespace    google
// @version      1.0.2
// @description  在谷歌翻译输入需要读取的文字后，点击下载音频，可以得到一个文字命名的 mp3 文件。
// @author       You
// @homepage     https://github.com/luneshao/GoogleTranslateAudioDownload
// @homepageURL  https://github.com/luneshao/GoogleTranslateAudioDownload
// @updateURL    https://github.com/luneshao/GoogleTranslateAudioDownload/blob/master/index.js
// @match        https://translate.google.cn/*
// @grant        GM_addStyle
// @grant        GM_download
// @license      MIT
// @supportURL   https://github.com/luneshao/GoogleTranslateAudioDownload/issues
// ==/UserScript==

;(function() {
  'use strict'

  // Your code here...
  const btnDownload = document.createElement('button') //下载按钮
  const sourceFooter = document.querySelector('.source-footer')
  const tkk = document.body.firstElementChild.textContent.match(
    /(?<=tkk\s?\:\s?\')\d+\.\d+/g
  )[0] // 截取tkk
  const jfkButton = document.querySelector('.src-tts.jfk-button-flat')
  GM_addStyle('.btn-download{margin:9px 0 0 4px;border: none;font-size: 16px;}')

  // 下载按钮初始化
  btnDownload.innerText = '下载音频'
  btnDownload.disabled =
    jfkButton && JSON.parse(jfkButton.getAttribute('aria-hidden'))
  btnDownload.classList.add('btn-download')
  btnDownload.addEventListener('click', handleDownload)
  sourceFooter.appendChild(btnDownload)
  
  /**
   * 计算tk的算法
   * @param {*} a 为你要翻译的原文
   */
  function vq(a, uq = tkk) {
    if (null !== uq) var b = uq
    else {
      b = sq('T')
      var c = sq('K')
      b = [b(), c()]
      b = (uq = window[b.join(c())] || '') || ''
    }
    var d = sq('t')
    c = sq('k')
    d = [d(), c()]
    c = '&' + d.join('') + '='
    d = b.split('.')
    b = Number(d[0]) || 0
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
      var l = a.charCodeAt(g)
      128 > l
        ? (e[f++] = l)
        : (2048 > l
            ? (e[f++] = (l >> 6) | 192)
            : (55296 == (l & 64512) &&
              g + 1 < a.length &&
              56320 == (a.charCodeAt(g + 1) & 64512)
                ? ((l =
                    65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023)),
                  (e[f++] = (l >> 18) | 240),
                  (e[f++] = ((l >> 12) & 63) | 128))
                : (e[f++] = (l >> 12) | 224),
              (e[f++] = ((l >> 6) & 63) | 128)),
          (e[f++] = (l & 63) | 128))
    }
    a = b
    for (f = 0; f < e.length; f++) (a += e[f]), (a = tq(a, '+-a^+6'))
    a = tq(a, '+-3^+b+-f')
    a ^= Number(d[1]) || 0
    0 > a && (a = (a & 2147483647) + 2147483648)
    a %= 1000000
    return a.toString() + '.' + (a ^ b)
  }

  /**
   * @param {*} a 为你要翻译的原文
   */
  function sq(a) {
    return function() {
      return a
    }
  }

  function tq(a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
      var d = b.charAt(c + 2)
      d = 'a' <= d ? d.charCodeAt(0) - 87 : Number(d)
      d = '+' == b.charAt(c + 1) ? a >>> d : a << d
      a = '+' == b.charAt(c) ? (a + d) & 4294967295 : a ^ d
    }
    return a
  }

  /**
   * 下载
   */
  function handleDownload() {
    const sourceVal = document.getElementById('source').value
    const url = `https://translate.google.cn/translate_tts?ie=UTF-8&q=${sourceVal}&tl=zh-CN&total=1&idx=0&textlen=1&tk=${vq(
      sourceVal
    )}&client=webapp&prev=input`
    const name = `${
      sourceVal.length <= 10 ? sourceVal : `${sourceVal.slice(0, 10)}_更多_`
    }.mp3`

    GM_download({
      url,
      name,
      onerror(err, details) {
        alert('下载失败，请在console中查看错误的详细信息 :)')
        console.error(`错误原因: ${err}`, `关于该错误的详细信息: ${details}`)
        console.info(
          '%c错误原因\nnot_enabled -用户未启用下载功能\nnot_whitelisted -所请求的文件扩展名没有列入白名单\nnot_permitted - 用户启用了下载功能，但没有给予下载权限\nnot_supported - 浏览器不支持下载功能\nnot_succeeded -下载启动失败，details属性提供更多信息',
          'color: #b689b0'
        )
      }
    })
  }

  /**
   * 下载按钮的禁用启用
   */
  function ifDisabled() {
    const ifHidden = jfkButton.getAttribute('aria-hidden')
    btnDownload.disabled = JSON.parse(ifHidden)
  }

  // 监听声音按钮的隐藏与出现控制打开按钮是否可用
  const config = { attributes: true, childList: false, subtree: false }
  const callback = mutationsList => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes') {
        if (mutation.attributeName === 'aria-hidden') ifDisabled()
      }
    }
  }
  const observer = new MutationObserver(callback)
  observer.observe(jfkButton, config)
})()
