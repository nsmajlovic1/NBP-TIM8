package com.formula.parts.tracker.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfiguration {

    public SwaggerConfiguration() {
        super();
    }

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
            .info(new Info()
                .title("Parts Tracker API")
                .version("1.0.0"))
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName,
                    new SecurityScheme()
                        .name(securitySchemeName)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
    }

    @Bean
    public GroupedOpenApi transportCompanyApi() {
        return GroupedOpenApi.builder()
            .group("transport-company-api")
            .packagesToScan("com.formula.parts.tracker.rest")
            .pathsToMatch("/api/transport-company/**")
            .build();
    }

    @Bean
    public GroupedOpenApi authenticationApi() {
        return GroupedOpenApi.builder()
            .group("authentication-api")
            .packagesToScan("com.formula.parts.tracker.rest")
            .pathsToMatch("/api/auth/**")
            .build();
    }

    @Bean
    public GroupedOpenApi teamApi() {
        return GroupedOpenApi.builder()
            .group("team-api")
            .packagesToScan("com.formula.parts.tracker.rest")
            .pathsToMatch("/api/team/**")
            .build();
    }

    @Bean
    public GroupedOpenApi addressApi() {
        return GroupedOpenApi.builder()
            .group("address-api")
            .packagesToScan("com.formula.parts.tracker.rest")
            .pathsToMatch("/api/address/**")
            .build();
    }

    @Bean
    public GroupedOpenApi storageApi() {
        return GroupedOpenApi.builder()
            .group("storage-api")
            .packagesToScan("com.formula.parts.tracker.rest")
            .pathsToMatch("/api/storage/**")
            .build();
    }

    @Bean
    public GroupedOpenApi carPartApi() {
        return GroupedOpenApi.builder()
            .group("car-part-api")
            .packagesToScan("com.formula.parts.tracker.rest")
            .pathsToMatch("/api/car-part/**")
            .build();
    }

    @Bean
    public GroupedOpenApi transportApi() {
        return GroupedOpenApi.builder()
            .group("transport-api")
            .packagesToScan("com.formula.parts.tracker.rest")
            .pathsToMatch("/api/transport/**")
            .build();
    }

    @Bean
    public GroupedOpenApi driverApi() {
        return GroupedOpenApi.builder()
            .group("driver-api")
            .packagesToScan("com.formula.parts.tracker.rest")
            .pathsToMatch("/api/driver/**")
            .build();
    }

    @Bean
    public GroupedOpenApi packageApi() {
        return GroupedOpenApi.builder()
            .group("package-api")
            .packagesToScan("com.formula.parts.tracker.rest")
            .pathsToMatch("/api/package/**")
            .build();
    }
    @Bean
    public GroupedOpenApi reportApi(){
        return GroupedOpenApi.builder()
                .group("report-api")
                .packagesToScan("com.formula.parts.tracker.rest")
                .pathsToMatch("/api/reports/storage/**")
                .build();
    }
    @Bean
    public GroupedOpenApi imageApi(){
        return GroupedOpenApi.builder()
                .group("image-api")
                .packagesToScan("com.formula.parts.tracker.rest")
                .pathsToMatch("/api/image/**")
                .build();
    }

}
