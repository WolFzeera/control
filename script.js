const alertMessages = [
    "Acesso Negado",
    "Apenas observe",
    "Não tente me apressar",
    "Seus toques são inúteis aqui",
    "A submissão exige paciência"
];

const alertOverlay = document.getElementById('alert-overlay');
const alertText = document.getElementById('alert-text');

document.addEventListener('contextmenu', e => {
    e.preventDefault();
    showAlert();
});

const interactables = ['start-scan-btn', 'file-input'];

document.addEventListener('click', (e) => {
    if (!interactables.includes(e.target.id)) {
        showAlert();
    }
});

let alertTimeout;
function showAlert() {
    clearTimeout(alertTimeout);
    const randomMsg = alertMessages[Math.floor(Math.random() * alertMessages.length)];
    alertText.innerText = randomMsg;
    alertOverlay.classList.add('active');

    alertTimeout = setTimeout(() => {
        alertOverlay.classList.remove('active');
    }, 2000);
}

const startBtn = document.getElementById('start-scan-btn');
const fileInput = document.getElementById('file-input');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const welcomeMessage = document.getElementById('welcome-message');

const phase1 = document.getElementById('phase-1');
const phase2 = document.getElementById('phase-2');
const phase3 = document.getElementById('phase-3');
const climaxPhoto = document.getElementById('climax-photo');

let capturedImageSrc = null;

// Force clear file input on load to ensure iOS prompts for camera every time
fileInput.value = '';

startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // Clear value right before click just in case
    fileInput.value = '';
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            capturedImageSrc = e.target.result;
            startScanning();
        }
        reader.readAsDataURL(e.target.files[0]);
    }
});

function startScanning() {
    startBtn.style.display = 'none';
    progressContainer.style.display = 'block';
    progressText.style.display = 'block';

    let progress = 0;

    const interval = setInterval(() => {
        if (progress < 80) {
            progress += Math.random() * 5 + 2;
            progressText.innerText = "Mapeando traços biométricos...";
        } else if (progress < 95) {
            progress += Math.random() * 0.5 + 0.1;
            progressText.innerText = "Sincronizando com o banco de dados...";
        } else if (progress < 99) {
            progress += 0.1;
            progressText.innerText = "Escaneando face...";
        } else if (progress >= 99 && progress < 100) {
            progress = 99;
            progressText.innerText = "Escaneando face...";

            if (!window.waitStart) window.waitStart = Date.now();
            if (Date.now() - window.waitStart > 8000) {
                progress = 100;
            }
        }

        if (progress >= 100) {
            clearInterval(interval);
            progressBar.style.width = '100%';
            progressText.innerText = "Acesso Concedido.";

            setTimeout(() => {
                progressContainer.style.display = 'none';
                progressText.style.display = 'none';
                welcomeMessage.style.display = 'block';

                setTimeout(() => {
                    welcomeMessage.style.opacity = 1;
                }, 50);

                setTimeout(() => {
                    transitionToPhase2();
                }, 4000);

            }, 1000);
        } else {
            progressBar.style.width = progress + '%';
        }
    }, 50);
}

function transitionToPhase2() {
    phase1.style.display = 'none';
    phase2.style.display = 'flex';
    checkAndRenderBlocks();
    setInterval(checkAndRenderBlocks, 1000);
}

const blocksData = [
    { hour: 17, text: 'Bom dia, minha princesa. Eu estava ocupado criando algo e cada linha de código tinha o seu nome; fiz isso para que você não consiga parar de pensar em mim, mesmo estando longe. A propósito, bela foto... eu vou devorar cada detalhe dela logo mais. Deixe-me te apresentar sua nova "cela". Sabe esse contador? Ele dita as regras hoje. A cada hora, um pedaço de mim se revela. Melhor ficar de olho, pequena... vai que você perde uma ordem.' },
    { hour: 18, text: 'Mas já? Não conteve a curiosidade, não é? Uma pena... não vou dizer muito nesta mensagem. Hoje eu vou ditar cada segundo seu, cada batida do seu coração, mas só porque fui breve agora, na próxima eu possa dizer mais.' },
    { hour: 19, text: 'O mundo deve estar barulhento agora, mas aqui dentro, é nosso silêncio, nossa paz. Lembre-se que enquanto eu estiver aqui, nada pode te tocar, nada vai te machucar... eu vou cuidar de você, como sempre cuidei, princesa.' },
    { hour: 20, text: 'Dez da manhã, está inquieta? Sei que adora desafios, então estou te desafiando. Eu sei que quer ver o final, mas será que ele vale a pena? Vai ter que descobrir. Aqui eu mando, as regras são minhas e você é minha, pequena... não tem opção a não ser... Obedecer.' },
    { hour: 21, text: 'Mais segundos se passaram, sabe o quanto eu perdi meu foco enquanto fazia isso? Só de pensar que tudo seria para você? Seu sorriso me derrete, sua voz de sono me acalma, seu suspiro me relaxa, sua existência nutre minha alma. Eu sei que estou te castigando com o tempo rodando, mas, por trás de tudo isso, existe um coração que se vê perdido sem você, uma alma sem destino nos confins de Hades. Falta pouco para esse contador parar...' },
    { hour: 22, text: 'Agora você deve estar cercada de pessoas, mas nenhuma delas é a que você procura... não é uma suposição, é uma afirmação, já que voltou para olhar o que foi revelado. Adoro saber que tenho o controle da sua atenção; você pode sorrir, rir, gargalhar, mas esse pequeno pergaminho mantém sua mente ativa para mim. Você está ansiosa para o xeque-mate, mas é só daqui a um tempo. Por enquanto, princesa, se distraia... a próxima hora será uma eternidade.' },
    { hour: 23, text: `Chegamos no finalmente, você é como a perfeição pintada a óleo em um quadro, agora como você teve paciência, vai ser recompensada, É irônico, eu construo, projeto, dou ordens, mas a única ordem que importa de fato é a que meu coração me dá, se ele tivesse como expressar, ele falaria para te amar sem nenhum limite, como a infinidade um universo vasto mas a única estrela que brilha é você, quando tento aplicar lógica aos meus sentimentos, eu simplesmento congelo, eles foram desenvolvidos não para serem lidos e sim ser sentidos, eu tentei buscar palavras com os maiores filósofos, mas nem eles tem para o que eu sinto por você, eu te amo de forma que quero ser o seu porto seguro onde nunca uma tempestade vai sequer te tocar.\n\nSabe minha princesa, eu te fiz esperar, te fiz tirar fotos, e isso te exigiu muita submissão, mas foi para que você sentisse a mesma ansiedade que sinto no peito enquanto escrevo isso, o tempo sem você é uma entropia congelada, você deu sentido a minha luta e persistência, eu não sei o futuro, mas sei que você vai criar um sentido para ele, como se tudo estivesse escuro e a ponte luminosa já estivesse pronta para ser trilhada, eu chamei de xeque-mate mas não é o fim, aqui eu determino o limite de onde começa minha posse sobre seus pensamentos\n\nLogo estarei acordado, quero que guarde cada pedaço dessa ansiedade, eu vou te buscar onde você estiver, e vou te provar que no meu mundo, você é a paz que eu sempre procurei, o sentimento que sempre me importei, Eu te amo, minha bratzinha, logo vou estar com você para transformar esse código inteiro em palavras ditas e não digitadas.\n\nPapai está com saudades...` }
];

let lastRenderedHour = null;

function checkAndRenderBlocks() {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= 23) {
        transitionToPhase3();
        return;
    }

    const container = document.getElementById('blocks-container');

    let nextRevealHour = null;
    blocksData.forEach((block) => {
        const isVisible = currentHour >= block.hour;
        const isNext = !isVisible && (nextRevealHour === null || block.hour < nextRevealHour);
        if (isNext) {
            nextRevealHour = block.hour;
        }
    });

    if (currentHour !== lastRenderedHour) {
        container.innerHTML = '';
        lastRenderedHour = currentHour;

        blocksData.forEach((block, index) => {
            const isVisible = currentHour >= block.hour;

            const div = document.createElement('div');
            div.className = 'block' + (isVisible ? ' visible' : ' locked');

            const timeDiv = document.createElement('div');
            timeDiv.className = 'block-time';
            timeDiv.innerText = `${String(block.hour).padStart(2, '0')}:00`;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'block-content';
            contentDiv.innerText = isVisible ? block.text : "CONTEÚDO PROTEGIDO. AGUARDE A LIBERAÇÃO.";

            div.appendChild(timeDiv);
            div.appendChild(contentDiv);
            container.appendChild(div);

            if (isVisible) {
                setTimeout(() => {
                    div.style.opacity = 1;
                    div.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }

    updateCountdown(nextRevealHour);
}

function updateCountdown(targetHour) {
    const countdownContainer = document.getElementById('countdown-container');
    if (targetHour === null) {
        countdownContainer.style.display = 'none';
        return;
    }

    countdownContainer.style.display = 'block';
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(targetHour, 0, 0, 0);

    let diff = targetTime - now;
    if (diff < 0) diff = 0;

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerText =
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

let climaxTriggered = false;
function transitionToPhase3() {
    if (climaxTriggered) return;
    climaxTriggered = true;

    phase2.style.display = 'none';
    phase3.style.display = 'flex';

    const finalMessageDiv = document.querySelector('.final-message');
    finalMessageDiv.innerHTML = `
        Chegamos no finalmente, você é como a perfeição pintada a óleo em um quadro, agora como você teve paciência, vai ser recompensada, É irônico, eu construo, projeto, dou ordens, mas a única ordem que importa de fato é a que meu coração me dá, se ele tivesse como expressar, ele falaria para te amar sem nenhum limite, como a infinidade um universo vasto mas a única estrela que brilha é você, quando tento aplicar lógica aos meus sentimentos, eu simplesmento congelo, eles foram desenvolvidos não para serem lidos e sim ser sentidos, eu tentei buscar palavras com os maiores filósofos, mas nem eles tem para o que eu sinto por você, eu te amo de forma que quero ser o seu porto seguro onde nunca uma tempestade vai sequer te tocar.<br><br>Sabe minha princesa, eu te fiz esperar, te fiz tirar fotos, e isso te exigiu muita submissão, mas foi para que você sentisse a mesma ansiedade que sinto no peito enquanto escrevo isso, o tempo sem você é uma entropia congelada, você deu sentido a minha luta e persistência, eu não sei o futuro, mas sei que você vai criar um sentido para ele, como se tudo estivesse escuro e a ponte luminosa já estivesse pronta para ser trilhada, eu chamei de xeque-mate mas não é o fim, aqui eu determino o limite de onde começa minha posse sobre seus pensamentos<br><br>Logo estarei acordado, quero que guarde cada pedaço dessa ansiedade, eu vou te buscar onde você estiver, e vou te provar que no meu mundo, você é a paz que eu sempre procurei, o sentimento que sempre me importei, Eu te amo, minha bratzinha, logo vou estar com você para transformar esse código inteiro em palavras ditas e não digitadas.<br><br>Papai está com saudades...
    `;

    if (capturedImageSrc) {
        climaxPhoto.src = capturedImageSrc;
        climaxPhoto.style.borderStyle = "solid";
    } else {
        climaxPhoto.style.display = "flex";
        climaxPhoto.src = "";
        climaxPhoto.alt = "Registro biométrico ausente... Mas a essência foi capturada.";
        climaxPhoto.style.borderStyle = "dashed";
        climaxPhoto.style.minHeight = "200px";
        climaxPhoto.style.width = "200px";
        climaxPhoto.style.alignItems = "center";
        climaxPhoto.style.justifyContent = "center";
        climaxPhoto.style.color = "var(--blood-red)";
        climaxPhoto.style.fontSize = "0.8rem";
        climaxPhoto.style.padding = "20px";
    }
}
