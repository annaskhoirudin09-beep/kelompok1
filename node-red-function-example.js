// Mengirim nilai jarak acak antara 0 dan 100
// Anda bisa menggantinya dengan data sensor aktual Anda
msg.payload = Math.floor(Math.random() * 100).toString(); 
return msg;