<template>
  <div id="app" class="app-container">
    <h1>File Management System</h1>
    <FileUpload @file-uploaded="fetchFiles" />
    <FileList ref="fileList" />
  </div>
</template>
<script>
import FileUpload from './components/FileUpload.vue';
import FileList from './components/FileList.vue';

export default {
  components: {
    FileUpload,
    FileList
  },
  methods: {
    fetchFiles() {
      this.$refs.fileList.fetchFiles();
    }
  }
};
</script>

<style scoped>
.app-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 50px;
  box-shadow: 0 20px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}
</style>