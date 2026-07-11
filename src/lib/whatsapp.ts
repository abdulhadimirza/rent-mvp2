/**
 * Mocks sending a WhatsApp message to a given phone number.
 * 
 * @param phoneNumber The phone number to send the message to
 * @param message The message body
 */
export async function sendWhatsappReminder(phoneNumber: string, message: string): Promise<void> {
  // Mock network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('================================================');
  console.log(`[MOCK WHATSAPP] Sending message to: ${phoneNumber}`);
  console.log(`[MOCK WHATSAPP] Message payload:\n${message}`);
  console.log('================================================');
}
