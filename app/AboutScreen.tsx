import React from "react";
import { ScrollView, View, Text, Image } from "react-native";
import styled from "styled-components/native";
// Styled Components
const Container = styled(ScrollView)`
  flex: 1;
  background-color: #f9f9f9; /* Change this to match your app's background */
  padding: 20px;
`;

const Header = styled(View)`
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled(Text)`
  font-size: 32px;
  font-weight: bold;
  color: #4a90e2; /* Main color of your app */
`;

const SubTitle = styled(Text)`
  font-size: 18px;
  color: #555;
  text-align: center;
  margin-top: 10px;
`;

const Section = styled(View)`
  margin-bottom: 30px;
`;

const SectionTitle = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const DeveloperList = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const DeveloperCard = styled(View)`
  align-items: center;
  margin: 10px;
  width: 120px;
`;

const DeveloperImage = styled(Image)`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  margin-bottom: 10px;
`;

const DeveloperName = styled(Text)`
  font-size: 16px;
  color: #333;
`;

const DeveloperRole = styled(Text)`
  font-size: 14px;
  color: #777;
`;

const AppDescription = styled(Text)`
  font-size: 16px;
  color: #333;
  line-height: 22px;
  text-align: justify;
`;

const Footer = styled(View)`
  align-items: center;
  padding: 10px;
`;

const FooterText = styled(Text)`
  font-size: 14px;
  color: #888;
`;

// About Screen Component
const AboutScreen = () => {
  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>About Our App</Title>
        <SubTitle>Learn more about the app and our team</SubTitle>
      </Header>

      {/* Developers Section */}
      <Section>
        <SectionTitle>Meet the Developers</SectionTitle>
        <DeveloperList>
          <DeveloperCard>
            <DeveloperImage
              source={{ uri: "" }} // Replace with developer image URL
            />
            <DeveloperName>Med Bouchalkha</DeveloperName>
            <DeveloperRole>Developer</DeveloperRole>
          </DeveloperCard>
          <DeveloperCard>
            <DeveloperImage
              source={{ uri: "" }} // Replace with developer image URL
            />
            <DeveloperName>Anas Tourari</DeveloperName>
            <DeveloperRole>Developer</DeveloperRole>
          </DeveloperCard>
        </DeveloperList>
      </Section>

      {/* App Description */}
      <Section>
        <SectionTitle>About the App</SectionTitle>
        <AppDescription>
          Our app is designed to help users manage their daily expenses, track
          budgets, and analyze their spending habits. With easy-to-use features
          and a user-friendly interface, you can take control of your financial
          health. Whether you're planning for savings or simply need to track
          your daily expenses, this app is your go-to solution.
        </AppDescription>
      </Section>

      {/* Footer */}
      <Footer>
        <FooterText>Version 1.0.0</FooterText>
        <FooterText>&copy; 2024 Your Company. All rights reserved.</FooterText>
      </Footer>
    </Container>
  );
};

export default AboutScreen;
