// Stellarium Web - Copyright (c) 2022 - Stellarium Labs SRL
//
// This program is licensed under the terms of the GNU AGPL v3, or
// alternatively under a commercial licence.
//
// The terms of the AGPL v3 license can be found in the main directory of this
// repository.

<template>
<v-dialog max-width='300' v-model="$store.state.showViewSettingsDialog">
<v-card v-if="$store.state.showViewSettingsDialog" style="backdrop-filter: blur(5px); background-color: rgba(64, 64, 64, 0.5);">
  <v-card-title><div class="text-h5">{{ $t('View settings') }}</div></v-card-title>
  <v-card-text>
    <v-checkbox hide-details :label="$t('Milky Way')" v-model="milkyWayOn"></v-checkbox>
    <v-checkbox hide-details :label="$t('DSS')" v-model="dssOn"></v-checkbox>
    <v-checkbox hide-details :label="$t('Meridian Line')" v-model="meridianOn"></v-checkbox>
    <v-checkbox hide-details :label="$t('Ecliptic Line')" v-model="eclipticOn"></v-checkbox>
    <v-checkbox hide-details :label="$t('High FPS')" v-model="highfpsOn"></v-checkbox>
    <v-checkbox hide-details :label="$t('HYA TEST')" v-model="hyatest" @change="onHyaTestChange"></v-checkbox>
    <v-checkbox hide-details :label="$t('File TEST')" v-model="filetest" @change="onFileTestChange"></v-checkbox>
    <v-checkbox hide-details :label="$t('Files TEST')" v-model="filestest" @change="triggerFileInput"></v-checkbox>
    <input type="file" id="fileInput" style="display: none;" @change="loadFile" />
    <input type="file" id="fixedFileInput" @change="loadFixedFile" style="display: none;" />

    <input type="file" id="filesInput" webkitdirectory multiple @change="handleDirectoryUpload" style="display: none;">
    
    
    <v-select v-model="selectedLanguage" :items="languages" :label="$t('Select Language')" @change="switchLanguage"></v-select>

  </v-card-text>
  <v-card-actions>
    <v-spacer></v-spacer><v-btn class="blue--text darken-1" text @click.native="$store.state.showViewSettingsDialog = false">Close</v-btn>
  </v-card-actions>
</v-card>
</v-dialog>
</template>

<script>

export default {
  data: function () {
    return {
      HighFPSMode: false,
      selectedLanguage: this.$i18n.locale,
      languages: [
        { text: 'English', value: 'en' },
        { text: 'Simplified Chinese', value: 'cn' }
      ],
      filetest: false, // 绑定复选框的值
      fileContent: null, // 用于存储文件内容
      fixedFilePath: '/home/hya/QUARCS/ext_src/astrometry.net/etc/astrometry.cfg', // 新增属性用于存储固定路径
    }
  },
  created() { 
    this.$bus.$on('ClientLanguage', this.switchLanguage);
    this.$bus.$on('HighFPSMode', this.switchHighFPSMode);
    // 在组件创建时，设置模块初始化的回调

  },
  mounted: function () {
    this.$bus.$emit('AppSendMessage', 'Vue_Command', 'getClientSettings');
    Module = window.Module || {}; // 获取全局 Module 对象
    Module['onRuntimeInitialized'] = () => {
      console.log("Emscripten module initialized.");
      // 这里可以安全地使用 FS
    };
  },
  methods: {
    // 切换语言的方法
    switchLanguage(lang) {
      this.$i18n.locale = lang;
      this.$bus.$emit('AppSendMessage', 'Vue_Command', 'saveToConfigFile:ClientLanguage:'+ lang);
    },
    switchHighFPSMode(Value) {
      if(Value === 'true'){
        window.setHighFrameRate(true);
        this.HighFPSMode = true;
      } else {
        window.setHighFrameRate(false);
        this.HighFPSMode = false;
      }
      console.log('setHighFPSMode:', this.HighFPSMode);
    },
    onHyaTestChange() {
      //window.callCoreTest();
      //window.solve_field();
      console.log("Checkbox HYA changed---------------"); 

      // 创建一个 Uint8Array 作为二进制数据
      const data = new Uint8Array([72, 101, 108, 108, 111]); // 例如，代表 "Hello" 的 ASCII 值

      // 使用 Module._malloc 分配内存
      const dataPtr = Module._malloc(data.length);
      // 将数据写入分配的内存
      Module.HEAPU8.set(data, dataPtr);
      // 调用 window.teststring 并传递指针和大小
      window.teststring(dataPtr, data.length);
      // 释放分配的内存
      Module._free(dataPtr);

    },
    onFileTestChange() {
      console.log("Checkbox changed:", this.filetest); // 添加打印语句
      if (this.filetest) {
        // 当复选框被选中时，触发文件输入框的点击事件
        document.getElementById('fileInput').click();
      } else {
        console.log("File TEST unchecked");
      }
    },
    loadFile(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target.result;
          //console.log("File content loaded:", fileContent);

          // 将文件内容转换为 Uint8Array
          const fileArray = new Uint8Array(fileContent);

          // 使用 TextDecoder 将 Uint8Array 转换为字符串
          const decoder = new TextDecoder("utf-8"); // 根据文件编码选择合适的编码
          const stringContent = decoder.decode(fileArray);
          //console.log("File content as string:", stringContent); // 打印字符串内容

          // 直接将 Uint8Array 传递给 window.sendfile
          window.sendfile(fileArray, fileArray.length);

          // 调用 loadFixedFile 读取固定路径的文件
          document.getElementById('filesInput').click(); // 触发astrometry.cfg点击事件
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
        };

        // 以二进制形式读取文件
        reader.readAsArrayBuffer(file);
        //reader.readAsText(file); // 以文本形式读取文件
      }
      
    },
    loadFixedFile(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target.result;
          //console.log("File config loaded:", fileContent);
          // 将文件内容转换为 Uint8Array
          const fileArray = new Uint8Array(fileContent);

          // 使用 TextDecoder 将 Uint8Array 转换为字符串
          const decoder = new TextDecoder("utf-8"); // 根据文件编码选择合适的编码
          const stringContent = decoder.decode(fileArray);
          //console.log("File config as string:", stringContent); // 打印字符串内容

          window.sendconfigfile(fileArray, fileArray.length);

          //document.getElementById('filesInput').click(); // 触发文件输入框的点击事件
          //reader.readAsArrayBuffer(file);
          window.solve_field();
          
        };
        
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
        };

        // 以文本形式读取文件
        //reader.readAsText(file);
        reader.readAsArrayBuffer(file);
      }
    },
    triggerFileInput() {
      document.getElementById('filesInput').click(); // 触发文件输入框的点击事件
    },
    handleDirectoryUpload(event) {
      const files = event.target.files; // 获取选择的文件
      //const fileContents = []; // 用于存储文件内容

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          // 读取文件内容
          const content = e.target.result;
          console.log(`文件 ${file.name} 的内容:`, content);

          const fileArray = new Uint8Array(content);
          const decoder = new TextDecoder("utf-8"); //根据文件编码选择合适的编码
          const stringContent = decoder.decode(fileArray);
          console.log("File config as string:", stringContent); // 打印字符串内容

          //fileContents.push({ name: file.name, content: content });

          // 这里可以处理文件内容，例如传递给 WebAssembly 函数
          window.sendindexfile(fileArray, file.name);
        };
        //reader.readAsText(file); // 读取文件内容
        reader.readAsArrayBuffer(file);
        document.getElementById('fixedFileInput').click(); // 触发astrometry.cfg点击事件

      }
      
    },
  },
  computed: {
    dssOn: {
      get: function () {
        return this.$store.state.stel.dss.visible
      },
      set: function (newValue) {
        this.$stel.core.dss.visible = newValue
      }
    },
    milkyWayOn: {
      get: function () {
        return this.$store.state.stel.milkyway.visible
      },
      set: function (newValue) {
        this.$stel.core.milkyway.visible = newValue
      }
    },
    meridianOn: {
      get: function () {
        return this.$store.state.stel.lines.meridian.visible
      },
      set: function (newValue) {
        this.$stel.core.lines.meridian.visible = newValue
      }
    },
    eclipticOn: {
      get: function () {
        return this.$store.state.stel.lines.ecliptic.visible
      },
      set: function (newValue) {
        this.$stel.core.lines.ecliptic.visible = newValue
      }
    },
    highfpsOn: {
      get: function () {
        return this.HighFPSMode
      },
      set: function (newValue) {
        window.setHighFrameRate(newValue)
        this.HighFPSMode = newValue
        
        this.$bus.$emit('AppSendMessage', 'Vue_Command', 'saveToConfigFile:HighFPSMode:'+ newValue)
      }
    },

  }
}
</script>

<style>
.input-group {
  margin: 0px;
}
</style>
