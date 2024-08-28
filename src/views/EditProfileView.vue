<template>
    <div>
      <h1>Edit Profile</h1>
      <form @submit.prevent="updateProfile">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" />
        <br />
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" />
        <br />
        <button type="submit">Update</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EditProfileView',
    data() {
      return {
        name: 'John Doe',
        email: 'john.doe@example.com'
      }
    },
    methods: {
      updateProfile() {
        // Implement update logic
        alert('Profile updated');
      }
    }
  }
  </script>
  
  <style scoped>
  h1 {
    color: #2c3e50;
  }
  form {
    margin-top: 20px;
  }
  </style>