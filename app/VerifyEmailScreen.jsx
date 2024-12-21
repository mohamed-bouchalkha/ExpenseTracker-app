import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const VerifyEmailScreen = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const route = useRoute(); // Pour récupérer les paramètres de l'URL

  useEffect(() => {
    const { token } = route.params; // Assurez-vous que le token est passé dans les paramètres

    if (token) {
      // Envoyer une requête GET au backend pour vérifier l'email avec le token
      axios
        .get(`http://localhost:5000/verify-email?token=${token}`)
        .then((response) => {
          setMessage(response.data.message); // Message de succès
          setLoading(false);
        })
        .catch((error) => {
          setMessage(error.response?.data?.message || 'Une erreur est survenue.');
          setLoading(false);
        });
    } else {
      setMessage('Token manquant.');
      setLoading(false);
    }
  }, [route.params]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View>
          <Text>{message}</Text>
          <Button title="Retour à l'accueil" onPress={() => { /* Rediriger vers la page d'accueil */ }} />
        </View>
      )}
    </View>
  );
};

export default VerifyEmailScreen;
