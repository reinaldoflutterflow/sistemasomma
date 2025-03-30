<template>
  <div class="qr-scanner-container">
    <div class="scanner-header">
      <h2>Escanear QR Code</h2>
      <button class="modal-close" @click="$emit('close')">&times;</button>
    </div>
    
    <div id="reader" ref="qrReader"></div>
    
    <div class="scanner-footer">
      <p class="scanner-message">{{ message }}</p>
      <button class="btn-secondary" @click="$emit('close')">Cancelar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Html5Qrcode } from 'html5-qrcode';

const props = defineProps({
  onSuccess: {
    type: Function,
    required: true
  },
  onError: {
    type: Function,
    default: () => {}
  }
});

const emit = defineEmits(['close', 'success', 'error']);

const qrReader = ref(null);
const message = ref('Posicione o QR Code no centro da câmera');
let html5QrCode = null;

onMounted(() => {
  startScanner();
});

onBeforeUnmount(() => {
  stopScanner();
});

const startScanner = async () => {
  try {
    if (!qrReader.value) return;
    
    html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    await html5QrCode.start(
      { facingMode: "environment" },
      config,
      onScanSuccess,
      onScanFailure
    );
  } catch (err) {
    console.error("Erro ao iniciar scanner:", err);
    message.value = "Erro ao acessar a câmera. Verifique as permissões.";
    emit('error', 'Erro ao acessar a câmera');
  }
};

const stopScanner = async () => {
  if (html5QrCode && html5QrCode.isScanning) {
    try {
      await html5QrCode.stop();
    } catch (err) {
      console.error("Erro ao parar scanner:", err);
    }
  }
};

const onScanSuccess = (decodedText) => {
  stopScanner();
  try {
    // Tentar fazer o parse do JSON do QR Code
    const data = JSON.parse(decodedText);
    emit('success', data);
    props.onSuccess(data);
  } catch (err) {
    console.error("Erro ao processar QR Code:", err);
    message.value = "QR Code inválido. Tente novamente.";
    emit('error', 'QR Code inválido');
    // Reiniciar o scanner após um erro
    setTimeout(() => {
      startScanner();
    }, 2000);
  }
};

const onScanFailure = (error) => {
  // Não fazer nada em caso de falha de leitura (é normal durante a varredura)
  // console.warn(`Falha na leitura do código: ${error}`);
};
</script>

<style scoped>
.qr-scanner-container {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.scanner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.scanner-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

#reader {
  width: 100%;
  min-height: 300px;
}

.scanner-footer {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scanner-message {
  margin-bottom: 16px;
  color: #666;
  text-align: center;
}

.btn-secondary {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #374151;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}
</style>
