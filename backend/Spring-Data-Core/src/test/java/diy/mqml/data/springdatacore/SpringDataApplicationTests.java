package diy.mqml.data.springdatacore;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;

@SpringBootTest
@ContextConfiguration(classes = SpringDataApplicationTests.TestConfig.class)
class SpringDataApplicationTests {

    @Configuration
    static class TestConfig {
        // Define beans or leave empty for minimal context
    }

    @Test
    void contextLoads() {
    }
}
