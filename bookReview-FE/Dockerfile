FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
FROM nginx:alpine
# Thêm dòng này để copy cấu hình Nginx của bạn vào container
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Đảm bảo đường dẫn này khớp với thư mục build của bạn (dist hoặc build)
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]