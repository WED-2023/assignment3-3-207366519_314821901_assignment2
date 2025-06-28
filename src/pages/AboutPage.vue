<template>
  <div class="about-page container">
    <div class="text-center mb-4">
      <h1 class="display-4">Welcome to our application!</h1>
      <p>We are <strong>Asaf</strong> and <strong>Lior</strong>, two passionate students exploring the world of web development environments.</p>
    </div>

    <div class="journey card shadow p-4 mb-4">
      <h2 class="h4 mb-3"><i class="bi bi-map-fill me-2 text-primary"></i>Our Journey</h2>
      <ul class="list-unstyled">
        <li>
          <strong>Asaf's first project:</strong>
          <a href="https://wed-2023.github.io/314821901/" target="_blank" class="project-link">View Project</a>
        </li>
        <li>
          <strong>Lior's first project:</strong>
          <a href="https://wed-2023.github.io/207366519/" target="_blank" class="project-link">View Project</a>
        </li>
        <li>
          <strong>Our first collaboration:</strong>
          <a href="https://wed-2023.github.io/assignment2-207366519_314821901_assignment2/" target="_blank" class="project-link">View Project</a>
        </li>
      </ul>
    </div>

    <div class="reflections card shadow p-4">
      <h2 class="h4 mb-3"><i class="bi bi-chat-left-quote-fill me-2 text-success"></i>Reflections</h2>
      <p>
        Working together on this project was a great experience. We enjoyed combining creativity with problem-solving
        and learned a lot about web development environments—from structure and design to interactivity.
      </p>
      <p>
        The web development environments course has been both challenging and rewarding. It gave us the tools to bring our ideas to life in the browser,
        and helped us better appreciate the power of clean, responsive design.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutPage"
};
</script>

<style scoped>
.about-page {
  padding: 2rem 1rem;
  animation: fadeIn 0.8s ease-in;
  font-size: 15px;
}

h1,
h2 {
  font-weight: 700;
}

.card {
  border-radius: 1rem;
  background-color: #f9f9f9;
}

.project-link {
  text-decoration: none;
  color: #0d6efd;
  font-weight: 500;
  transition: color 0.2s ease;
}

.project-link:hover {
  color: #0a58ca;
  text-decoration: underline;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
