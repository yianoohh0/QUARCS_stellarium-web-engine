/* Stellarium Web Engine - Copyright (c) 2022 - Stellarium Labs SRL
 *
 * This program is licensed under the terms of the GNU AGPL v3, or
 * alternatively under a commercial licence.
 *
 * The terms of the AGPL v3 license can be found in the main directory of this
 * repository.
 */

var highframeRate = false; // 默认低帧率

Module.afterInit(function() {
  if (!Module.canvas) return;

  // XXX: remove this I guess.
  var mouseDown = false;
  var mouseButtons = 0;
  var mousePos;

  // Function called at each frame
  var render = function(timestamp) {

    if (mouseDown)
      Module._core_on_mouse(0, 1, mousePos.x, mousePos.y, mouseButtons);

    // Check for canvas resize
    var canvas = Module.canvas;

    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;

    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();

    var displayWidth  = rect.width;
    var displayHeight = rect.height;
    var sizeChanged = (canvas.width  !== displayWidth) ||
                      (canvas.height !== displayHeight);

    if (sizeChanged) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    // TODO: manage paning and flicking here

    Module._core_update();
    Module._core_render(displayWidth, displayHeight, dpr);

    if(highframeRate) {
      window.requestAnimationFrame(render);
    } else {
      // Adjust the frame rate to 15 frames per second
      setTimeout(function () {
        window.requestAnimationFrame(render);
      }, 1000 / 18); // 15 FPS
    }
  }

  var fixPageXY = function(e) {
    if (e.pageX == null && e.clientX != null ) {
      var html = document.documentElement
      var body = document.body
      e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0)
      e.pageX -= html.clientLeft || 0
      e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0)
      e.pageY -= html.clientTop || 0
    }
  };

  var setupMouse = function() {
    var canvas = Module.canvas;
    function getMousePos(evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    }

    canvas.addEventListener('mousedown', function(e) {
      var that = this;
      e = e || event;
      fixPageXY(e);
      mouseDown = true;
      mousePos = getMousePos(e);
      mouseButtons = e.buttons;

      document.onmouseup = function(e) {
        e = e || event;
        fixPageXY(e);
        mouseDown = false;
        mousePos = getMousePos(e);
        Module._core_on_mouse(0, 0, mousePos.x, mousePos.y, mouseButtons);
      };
      document.onmouseleave = function(e) {
        mouseDown = false;
      };

      document.onmousemove = function(e) {
        e = e || event;
        fixPageXY(e);
        mousePos = getMousePos(e);
      }
    });

    canvas.addEventListener('touchstart', function(e) {
      var rect = canvas.getBoundingClientRect();
      for (var i = 0; i < e.changedTouches.length; i++) {
        var id = e.changedTouches[i].identifier;
        var relX = e.changedTouches[i].pageX - rect.left;
        var relY = e.changedTouches[i].pageY - rect.top;
        Module._core_on_mouse(id, 1, relX, relY, 1);
      }
    }, {passive: true});
    canvas.addEventListener('touchmove', function(e) {
      e.preventDefault();
      var rect = canvas.getBoundingClientRect();
      for (var i = 0; i < e.changedTouches.length; i++) {
        var id = e.changedTouches[i].identifier;
        var relX = e.changedTouches[i].pageX - rect.left;
        var relY = e.changedTouches[i].pageY - rect.top;
        Module._core_on_mouse(id, -1, relX, relY, 1);
      }
    }, {passive: false});
    canvas.addEventListener('touchend', function(e) {
      var rect = canvas.getBoundingClientRect();
      for (var i = 0; i < e.changedTouches.length; i++) {
        var id = e.changedTouches[i].identifier;
        var relX = e.changedTouches[i].pageX - rect.left;
        var relY = e.changedTouches[i].pageY - rect.top;
        Module._core_on_mouse(id, 0, relX, relY, 1);
      }
    });

    function getMouseWheelDelta(event) {
      var delta = 0;
      switch (event.type) {
        case 'DOMMouseScroll':
          delta = -event.detail;
          break;
        case 'mousewheel':
          delta = event.wheelDelta / 120;
          break;
        default:
          throw 'unrecognized mouse wheel event: ' + event.type;
      }
      return delta;
    }

    var onWheelEvent = function(e) {
      e.preventDefault();
      fixPageXY(e);
      var pos = getMousePos(e);
      var zoom_factor = 1.05;
      var delta = getMouseWheelDelta(e) * 2;
      Module._core_on_zoom(Math.pow(zoom_factor, delta), pos.x, pos.y);
      return false;
    };
    canvas.addEventListener('mousewheel', onWheelEvent, {passive: false});
    canvas.addEventListener('DOMMouseScroll', onWheelEvent, {passive: false});

    canvas.oncontextmenu = function(e) {
      e.preventDefault();
      e.stopPropagation();
    }

  };

  setupMouse();

  // Kickoff rendering at max FPS, normally 60 FPS on a browser.
  window.requestAnimationFrame(render)


});

// 通过 window 对象暴露 setFrameRate 函数，使其成为全局变量
window.setHighFrameRate = function(newFrameRate) {
  highframeRate = newFrameRate;
};

window.getHighFrameRate = function() {
  return highframeRate;
}


window.solve_field = function() {


    // 构造参数
    const args = [
        "solve_field",               // 程序名称
        "--fits-image", "/home/hya/a.fits",   // 第一个参数及其值
        "--overwrite",               // 第二个参数
        "--scale-units", "degwidth", // 第三个参数及其值
        "--radius", "10",           // 第四个参数及其值
        "--nsigma", "12",           // 第五个参数及其值
        "--no-plots",               // 第六个参数
        "--no-remove-lines",        // 第七个参数
        "--uniformize", "0",        // 第八个参数及其值
        "--timestamp",                // 第九个参数
        "-v",              
    ];

    // 计算参数数量
    const argc = args.length;

    // 分配内存以存储指向字符串的指针
    const argv = Module._malloc(argc * 4); // 每个指针占用 4 字节
    const stringPointers = new Array(argc);

    // 为每个字符串分配内存并存储指针
    for (let i = 0; i < argc; i++) {
        const str = args[i];
        const strLength = Module.lengthBytesUTF8(str) + 1; // +1 用于 null-terminated 字符串
        const strPtr = Module._malloc(strLength);
        Module.stringToUTF8(str, strPtr, strLength); // 将字符串写入内存
        stringPointers[i] = strPtr; // 存储指针
        // 将每个字符串指针存储到 argv 中
        Module.HEAP32[(argv >> 2) + i] = strPtr; // 使用 HEAP32 直接操作内存
    }

    // 调用 C 函数
    Module._run_solve_field(argc, argv);

    // 释放分配的内存
    for (let i = 0; i < argc; i++) {
        Module._free(stringPointers[i]); // 释放每个字符串的内存
    }
    Module._free(argv); // 释放指向字符串指针的内存

    console.log("Module._run_solve_field is called successfully.");
  


};

// window.solve_field = function(file) {


//   const args = [
//       "solve_field",               // 程序名称
//       "--fits-image", "/home/hya/a.fits",   // 第一个参数及其值
//       "--overwrite",               // 第二个参数
//       "--scale-units", "degwidth", // 第三个参数及其值
//       "--radius", "10",           // 第四个参数及其值
//       "--nsigma", "12",           // 第五个参数及其值
//       "--no-plots",               // 第六个参数
//       "--no-remove-lines",        // 第七个参数
//       "--uniformize", "0",        // 第八个参数及其值
//       "--timestamp",                // 第九个参数
//       "-v",              
//   ];

//   // 计算参数数量
//   const argc = args.length;

//   // 分配内存以存储指向字符串的指针
//   const argv = Module._malloc(argc * 4); // 每个指针占用 4 字节
//   const stringPointers = new Array(argc);

//   // 为每个字符串分配内存并存储指针
//   for (let i = 0; i < argc; i++) {
//       const str = args[i];
//       const strLength = Module.lengthBytesUTF8(str) + 1; // +1 用于 null-terminated 字符串
//       const strPtr = Module._malloc(strLength);
//       Module.stringToUTF8(str, strPtr, strLength); // 将字符串写入内存
//       stringPointers[i] = strPtr; // 存储指针
//       // 将每个字符串指针存储到 argv 中
//       Module.HEAP32[(argv >> 2) + i] = strPtr; // 使用 HEAP32 直接操作内存
//   }

//   // // 打印 argv 内容以调试
//   // for (let i = 0; i < argc; i++) {
//   //     const argString = Module.UTF8ToString(stringPointers[i]);
//   //     console.log(`argv[${i}]: ${argString}`);
//   // }

//   // 调用 C 函数
//   Module._run_solve_field(argc, argv);

//   // 释放分配的内存
//   for (let i = 0; i < argc; i++) {
//       Module._free(stringPointers[i]); // 释放每个字符串的内存
//   }
//   Module._free(argv); // 释放指向字符串指针的内存

//   console.log("Module._run_solve_field is called successfully.");
// };

window.sendfile = function(fileContent){
  // 打印 fileContent 的内容
  console.log("File content:", fileContent);

  // 打印 fileContent 的字符串表示（如果是文本文件）
  const stringData = new TextDecoder("utf-8").decode(fileContent);
  console.log("Decoded file content as string:", stringData);

  // 如果需要将数据传递给 C 函数，您可以使用 Module._malloc 分配内存
  const filePtr = Module._malloc(fileContent.length);
  Module.HEAPU8.set(fileContent, filePtr);

  // 调用 C 函数处理文件
  Module._process_file(filePtr, fileContent.length);

  // 释放分配的内存
  Module._free(filePtr);
}

window.sendindexfile = function(fileContent, fileName) {
  // 打印 fileContent 的内容
  console.log("INDEX File content:", fileContent);
  console.log("INDEX File fileName:", fileName);

  // 如果需要将数据传递给 C 函数，您可以使用 Module._malloc 分配内存
  const filePtr = Module._malloc(fileContent.length);
  Module.HEAPU8.set(fileContent, filePtr);

  // 分配内存以存储文件名
  const namePtr = Module._malloc(fileName.length + 1); // +1 for null terminator
  Module.stringToUTF8(fileName, namePtr, fileName.length + 1); // 将字符串复制到 WebAssembly 内存

  // 调用 C 函数处理文件
  Module._process_index_file(filePtr, fileContent.length, namePtr);

  // 释放分配的内存
  Module._free(filePtr);
}


window.sendconfigfile = function(fileContent){
  // 打印 fileContent 的内容
  console.log("File content:", fileContent);

  // 打印 fileContent 的字符串表示（如果是文本文件）
  const stringData = new TextDecoder("utf-8").decode(fileContent);
  console.log("Decoded config file content as string:", stringData);

  // 如果需要将数据传递给 C 函数，您可以使用 Module._malloc 分配内存
  const filePtr = Module._malloc(fileContent.length);
  Module.HEAPU8.set(fileContent, filePtr);

  // 调用 C 函数处理文件
  Module._process_config_file(filePtr, fileContent.length);

  // 释放分配的内存
  Module._free(filePtr);
}

window.teststring = function(dataPtr, dataSize) {
  // 从 WebAssembly 内存中读取二进制数据
  const binaryData = new Uint8Array(Module.HEAPU8.buffer, dataPtr, dataSize);

  // 打印传入的二进制数据
  console.log("Received binary data:", binaryData);

  // 如果需要，可以将二进制数据转换为字符串并打印
  const stringData = new TextDecoder().decode(binaryData);
  console.log("Decoded string from binary data:", stringData);
}

window.callCoreTest = function() {
  if (typeof Module._core_test2 === 'function') {
      // 定义字符串数组
      const strings = [
          "aaabbb",
          "bbbccc",
      ];
      console.log("Strings array:", strings);

      // 分配内存以存储指向字符串的指针
      const numStrings = strings.length;
      const stringPointers = new Array(numStrings);

      // 为每个字符串分配内存并存储指针
      for (let i = 0; i < numStrings; i++) {
          const str = strings[i];
          const strLength = Module.lengthBytesUTF8(str) + 1; // +1 用于 null-terminated 字符串
          const strPtr = Module._malloc(strLength);
          Module.stringToUTF8(str, strPtr, strLength); // 将字符串写入内存
          stringPointers[i] = strPtr; // 存储指针
      }

      // 分配内存以存储指向字符串指针的指针
      const pointersPtr = Module._malloc(numStrings * 4); // 每个指针占用 4 字节

      // 将每个字符串指针存储到指针数组中
      for (let i = 0; i < numStrings; i++) {
          // 使用 HEAP32 直接操作内存
          Module.HEAP32[(pointersPtr >> 2) + i] = stringPointers[i]; // 将每个字符串指针存储到指针数组中
      }


      // 调用 C 函数
      Module._core_test2(numStrings, pointersPtr);

      // 释放分配的内存
      for (let i = 0; i < numStrings; i++) {
          Module._free(stringPointers[i]); // 释放每个字符串的内存
      }
      Module._free(pointersPtr); // 释放指针数组的内存

      console.log("Module._core_test2 is called successfully.");
  } else {
      console.error("Module._core_test2 is not a function");
  }
}