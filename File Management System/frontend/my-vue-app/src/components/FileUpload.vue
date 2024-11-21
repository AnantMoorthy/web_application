<template>
  <div class="file-upload">
    <h2>Upload File</h2>
    <input type="file" @change="onFileChange" />
    <button @click="uploadFile" class="upload-button">Upload</button>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedFile: null,
      message: ''
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadFile() {
      if (!this.selectedFile) {
        this.message = 'Please select a file first.';
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        const response = await fetch('http://localhost:8080/upload', {
          method: 'POST',
          body: formData
        });
        
        const responseData = await response.json();

        if (response.ok) {
          this.message = 'File uploaded successfully!';
          this.$emit('file-uploaded'); // emit an event to refresh the file list
          setTimeout(() => {
            this.message = '';
          }, 3000);
        } else {
          this.message = `File upload failed: ${responseData.error || 'Unknown error'}`;
        }
      } catch (error) {
        console.error('Error:', error);
        this.message = 'An error occurred while uploading the file.';
      }
    }
  }
};
</script>

<style scoped>
@import '../assets/base.css';
.file-upload {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 5px;
  margin: 20px 0;
  text-align: center;
}

.upload-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
}

.upload-button:hover {
  background-color: #45a049;
}

.message {
  margin-top: 10px;
  color: #d9534f;
}
</style>