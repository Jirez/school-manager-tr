export function formatError(error: any) {
  if (error.networkError) {
    return `Impossible de joindre le serveur, vérifiez votre connection réseau`;
  } else {
    return error.message.split(":")[1] || error.message;
  }
}
