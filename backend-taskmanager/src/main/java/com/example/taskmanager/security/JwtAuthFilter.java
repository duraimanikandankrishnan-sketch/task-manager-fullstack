package com.example.taskmanager.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    private static final List<String> WHITELIST = List.of(
    "/api/auth",
    "/api/auth/",
    "/h2-console",
    "/h2-console/",
    "/actuator/health","/actuator/health/**"
);

    public JwtAuthFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {

     try {       

    String path = request.getRequestURI();
    System.out.println("➡️ JwtAuthFilter processing: " + path);

   if (path.trim().startsWith("/api/auth/login")) {
       chain.doFilter(request, response);
       return;
   }

   // ✅ Skip authentication for auth endpoints and H2 console
   if (path.startsWith("/api/auth/") || path.startsWith("/h2-console")||path.startsWith("/actuator")) {
     System.out.println("➡️ JwtAuthFilter processing inside filter: " + path);
       chain.doFilter(request, response);
       return;
   }

    //if (WHITELIST.stream().anyMatch(path::startsWith)) {
      //  chain.doFilter(request, response);
        //return;
   // }

    String authHeader = request.getHeader("Authorization");

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(token)) {
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
    }

    chain.doFilter(request, response);
}catch(Exception e)
{
    e.printStackTrace();
    chain.doFilter(request, response);
}
}

}
