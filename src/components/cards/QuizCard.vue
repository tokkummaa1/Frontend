<template>
  <div v-if="assessment.questions?.length" class="bg-white p-6 rounded-lg shadow-md mb-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold">{{ assessment.title }}</h3>
      <span class="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800">
        {{ assessment.assessment_type }}
      </span>
    </div>

    <!-- Quiz Info -->
    <div class="mb-4 space-y-2" v-if="currentAttempt">
      <p class="text-gray-600 font-medium">
        Your Score: {{ currentAttempt.score }}/{{ totalMarks }}
      </p>
    </div>

    <!-- Questions -->
    <div v-for="(question, qIndex) in assessment.questions" :key="question.id" 
         class="mb-6 border-b pb-4 last:border-b-0">
      <h4 class="font-medium mb-3 text-gray-800">{{ qIndex + 1 }}. {{ question.text }}</h4>
      <div v-for="choice in question.choices" :key="choice.id" class="ml-4 mb-2">
        <label class="flex items-center space-x-2 cursor-pointer" 
               :class="getChoiceClasses(question, choice, qIndex)">
          <input 
            type="radio" 
            v-model="userResponses[qIndex]" 
            :value="choice.id"
            class="form-radio h-4 w-4 transition duration-150 ease-in-out"
            :class="getRadioClasses(choice, qIndex)"
            :disabled="hasSubmitted"
          >
          <span class="text-gray-700">{{ choice.text }}</span>
        </label>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="gap-2">
      <button 
        @click="submitQuiz"
        :disabled="isSubmitDisabled || hasSubmitted"
        class="mt-4 w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ hasSubmitted ? 'Submitted' : 'Submit Quiz' }}
      </button>
      
      <button
        v-if="showRetry"
        @click="retryQuiz"
        class="mt-4 w-full bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 hover:cursor-pointer transition-colors"
      >
        Retry Quiz
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuizStore } from '@/store/quizStore';

const props = defineProps({
  assessment: Object,
  entityId: [Number, String]
});

const quizStore = useQuizStore();
const userResponses = ref([]);

// Calculate total marks
const totalMarks = computed(() => {
  return props.assessment.questions.reduce((acc, question) => acc + question.marks, 0);
});

// Initialize responses from existing attempt
onMounted(() => {
  if (currentAttempt.value) {
    userResponses.value = currentAttempt.value.responses
      .sort((a, b) => a.question - b.question)
      .map(response => response.chosen_choice);
  }
});

const isSubmitDisabled = computed(() => {
  return userResponses.value.length !== props.assessment.questions.length ||
         userResponses.value.some(r => r === null);
});

const currentAttempt = computed(() => {
  return quizStore.attempts.find(a => a.assessment === props.assessment.id);
});

const hasSubmitted = computed(() => !!currentAttempt.value);
const showRetry = computed(() => currentAttempt.value && !currentAttempt.value.passed);

const getChoiceClasses = (question, choice) => {
  const response = currentAttempt.value?.responses.find(r => r.question === question.id);
  
  if (response?.chosen_choice === choice.id) {
    return {
      'bg-red-100': !choice.is_correct,
      'bg-green-100': choice.is_correct
    };
  }
  

  return {};
};


const getRadioClasses = (choice, qIndex) => {
  if (hasSubmitted.value) {
    return 'text-gray-400'; 
  }
  return userResponses.value[qIndex] === choice.id ? 'text-blue-600' : 'text-gray-300';
};

const submitQuiz = async () => {
  if (isSubmitDisabled.value) {
    alert('Please answer all questions before submitting');
    return;
  }

  const formattedResponses = userResponses.value.map((choiceId, index) => ({
    question: Number(props.assessment.questions[index].id),
    chosen_choice: Number(choiceId)
  }));

  try {
    await quizStore.submitAttempt(Number(props.assessment.id), formattedResponses);
  } catch (error) {
    alert(`Error: ${error.response?.data?.detail || 'Submission failed'}`);
  }
};

const retryQuiz = async () => {
  if (!currentAttempt.value) return;
  
  try {
    await quizStore.deleteAttempt(currentAttempt.value.id);
    userResponses.value = [];
    await quizStore.fetchAttempts(); // Refresh attempts list
  } catch (error) {
    alert(error.message || 'Failed to reset quiz attempt. Please try again.');
  }
};
</script>