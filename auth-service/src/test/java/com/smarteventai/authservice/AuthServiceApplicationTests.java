package com.smarteventai.authservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(
  properties = {
    "spring.datasource.url=jdbc:postgresql://localhost:5432/auth_db",
    "spring.datasource.username=postgres",
    "spring.datasource.password=postgres"
  }
)
@ActiveProfiles("test")
class AuthServiceApplicationTests {

    @Test
    void contextLoads() {
    }

}
