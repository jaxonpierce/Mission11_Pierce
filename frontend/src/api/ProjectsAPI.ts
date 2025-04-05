const API_URL = import.meta.env.VITE_API_BASE_URL; // Automatically uses .env or .env.production

export const ProjectsAPI = {
  async getAllProjects() {
    const response = await fetch(`${API_URL}/api/projects`);
    if (!response.ok) throw new Error("Failed to fetch projects");
    return response.json();
  },

  async getProjectById(id: number) {
    const response = await fetch(`${API_URL}/api/projects/${id}`);
    if (!response.ok) throw new Error("Project not found");
    return response.json();
  },

  async createProject(project: any) {
    const response = await fetch(`${API_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error("Failed to create project");
    return response.json();
  },

  async updateProject(id: number, project: any) {
    const response = await fetch(`${API_URL}/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error("Failed to update project");
    return response.json();
  },

  async deleteProject(id: number) {
    const response = await fetch(`${API_URL}/api/projects/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete project");
  },
};
