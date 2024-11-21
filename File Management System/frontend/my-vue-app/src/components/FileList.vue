<template>
  <div class="file-list">
    <h2>Uploaded Files</h2>
    <div v-if="files.length === 0" class="no-files">No files uploaded.</div>
    <div v-else>
      <FileItem
        v-for="file in files"
        :key="file._id"
        :file="file"
        @file-deleted="handleFileDeleted"
      />
    </div>
    <p v-if="deletedMessage" class="message">{{ deletedMessage }}</p>
  </div>
</template>

<script>
import FileItem from './FileItem.vue';

export default {
  components: { FileItem },
  data() {
    return {
      files: [],
      deletedMessage: '' // initialize message variable
    };
  },
  methods: {
    async fetchFiles() {
      try {
        const response = await fetch('http://localhost:8080/files');  // fetch files from the server
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        this.files = await response.json();  // parse JSON response and assign to files
      } catch (error) {
        console.error('Error fetching files:', error);  // log any errors
      }
    },
    async deleteFile(fileId) {
      try {
        const response = await fetch(`http://localhost:8080/files/${fileId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          this.$emit('file-deleted'); // emit an event to refresh the file list
        } else {
          const errorData = await response.json();
          console.error('Failed to delete file', errorData.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    handleFileDeleted(file) {
      this.deletedMessage = `${file.filename} has been deleted.`; 
      this.fetchFiles(); // refresh the file list
      setTimeout(() => {
        this.deletedMessage = ''; // message cleared after a few seconds
      }, 3000); // duration changed as required
    }
  },
  created() {
    this.fetchFiles();
  }
};
</script>

<style scoped>
.file-list {
  margin: 20px 0;
}

.no-files {
  color: #999;
  text-align: center;
  padding: 20px;
}

.message {
  color: #d9534f;
  margin-top: 10px;
}
</style>