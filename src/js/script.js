// DECLARAÇÕES DOS ELEMENTOS USANDO DOM(DOCUMENT OBJECT MODEL)
const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

// FUNÇÃO QUE VAI HABILITAR A CÂMERA

async function configurarCamera() {
    try{
        const midia = await navigator.mediaDevices.getUserMedia({
            video:{facingMode: "environment"},// habilitando a câmera traseira
            audio: false
        })
        videoElemento.srcObject = midia;
        videoElemento.play(); //garante que o video comece
    }catch(erro){
        resultado.innerText = "Erro ao acessar a camera",erro;
    }
}

//Executa a função da camera
configurarCamera();

// função para ler o texto da imagem
botaoScanear.onclick = async()=>{
    botaoScanear.disable=true;
    resultado.innerText="Fazendo a leiura...aguarde";

    //chama a estrututra do canvas
    const context = canvas.getContext("2d");

    //ajusta o tamanho da tela
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    //reset de qualquer tranformação para garantir que a foto não fique invertida
    context.setTrasform(1, 0, 1, 0, 0);

    //Aplica o filtro de contraste e escala conza no canvas antes de tirar a foto(ajuda a evitar aleatórias)
    context.filter = 'contrast(1.2) grayscale(1)';
    
    //construindo a tela para tirar foto
    context.drawImage(videoElemento, 0,0 , canvas.width ,canvas.height);
    try{
        //Captura o texto da imagem e traduz para o português
        const {data: { text }} = await Tesseract.recogize(
            canvas,
            'por'
        );
        //remove espaços em branco
        const textoFinal = text.trim();

        resultado.innerText = textoFinal.length > 0 ? textoFinal : "Não foi possivel identificar o texto"
    }catch(erro){
        console.error(erro);
        resultado.innerText= "Erro ao processar",erro;
    }finally{
        //Desabilita o botão para começar nova leitura
        botaoScanear.disable=false;

    }
}