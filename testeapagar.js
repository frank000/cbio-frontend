<script>
// Selecionar todos os botões
const buttons = document.querySelectorAll('.select-button');
const formContainer = document.getElementById('planForm');
const selectedPlanSpan = document.getElementById('selectedPlan');
const userNameInput = document.getElementById('userName');
const userEmailInput = document.getElementById('userEmail');

// Adicionar evento de clique para cada botão
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const planName = button.getAttribute('data-plan');
        const planId = button.getAttribute('data-plan-id');
        selectedPlanSpan.textContent = planName;
        selectedPlanSpan.id = planId;
        formContainer.classList.add('active');
        
        // Scroll suave até o formulário
        formContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Foca no campo de nome
        userNameInput.focus();
    });
});

// Função para lidar com o botão avançar
function handleAdvance() {
    const userName = userNameInput.value.trim();
    if (!userName) {
        alert('Por favor, digite seu nome para continuar.');
        return;
    }

    const userEmail = userEmailInput.value.trim();
    if (!userEmail) {
        alert('Por favor, digite seu email para continuar.');
        return;
    } else if (!isValidEmail(userEmail)) {
        alert('Por favor, digite um email válido.');
        return;
    }
    
    // Aqui você pode adicionar a lógica para processar o formulário
    console.log('Plano:', selectedPlanSpan.textContent);
    console.log('Nome:', userName);
    
    selectedPlanSpan.userName = userName;
    selectedPlanSpan.userEmail =userEmail;
    callPage(selectedPlanSpan);
    // Exemplo de próximo passo
    alert(`Obrigado ${userName}! Você escolheu o plano ${selectedPlanSpan.textContent}`);
}

// Função para validar email usando regex
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function callPage(value) {
    // Exemplo do payload que você pode enviar para o seu backend
    const payload = {
    "customerName":value.userName,
    "customerEmail": value.userEmail,
    "items":[{
        "name":value.textContent,
        "id":value.id
    }]
};

    fetch('https://pleasing-elf-instantly.ngrok-free.app/v1/payment/subscriptions/trial', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => { 
        // Verifique se a API retornou uma URL válida para redirecionamento
        if (data && data.url) {
            // Redireciona o usuário para a URL retornada pela API
            window.location.href = data.url;
        } else {
            // Caso não haja URL, exibe um erro ou mensagem para o usuário
            alert('Erro ao processar o pagamento. Tente novamente mais tarde.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro de comunicação com o servidor. Tente novamente.');
    });
}
</script>