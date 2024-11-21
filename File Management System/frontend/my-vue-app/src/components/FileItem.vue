<template>
  <div class="file-item">
    <span class="filename">{{ file.filename }}</span>
    <button @click="deleteFile" class="delete-button">Delete</button>
  </div>
</template>

<script>
export default {
  props: {
    file: Object
  },
  data() {
    return {
      deletedMessage: '' // message variable for deleted file
    };
  },
  methods: {
    async deleteFile() {
      if (confirm('Are you sure you want to delete this file?')) {
        try {
          const response = await fetch(`http://localhost:8080/files/${this.file._id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            this.deletedMessage = `${this.file.filename} has been deleted.`; 
            this.$emit('file-deleted', this.file); // emit an event to refresh the file list
            setTimeout(() => {
              this.deletedMessage = ''; // message cleared after a few seconds
            }, 3000); // duration changed as required
          } else {
            const errorData = await response.json();
            console.error('Failed to delete file', errorData.error);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
  }
};
</script>

<style scoped>
@import '../assets/base.css';
.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 5px 0;
}

.filename {
  font-weight: bold;
}

.delete-button {
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.delete-button:hover {
  background-color: #c9302c;
}

.deleted-message {
  color: #d9534f; 
  margin-top: 10px;
}
</style>