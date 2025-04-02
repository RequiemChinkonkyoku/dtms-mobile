import ApiManager from './ApiManager';

export const fetchSkillById = async (id) => {
    try {
        const response = await ApiManager.get(`/skills/${id}`);
        console.log('Skill Details:', response.data);
        return response.data.object;
    } catch (error) {
        console.error('Error fetching skill by ID:', error);
        return null;
    }
};