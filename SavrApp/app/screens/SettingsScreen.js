  const navigation = useNavigation();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // TODO : Replace with our API endpoint
        // const response = await fetch("", {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${await getToken()}`,
        //   },
        // });
        // const data = await response.json();

        // Fake response for demonstration purposes
        const response = {
          data: {
            role: "user",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@domain.com",
          },
          ok: true,
        }
        const data = response.data;

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        console.log("User data:", data);
        setUser(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigation.navigate("Error", { error: "Failed to load user data" });
      }
    };
};

export default SettingsScreen;
