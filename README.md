# EffectiveMobileTZ
## npm run migrate - запуск миграций для бд 
## npm run server - запуск сервера
### Access header для jwt 
### /user/get - получить пользователя по id
#### body: {userId: 'integer'}
### /user/register - регистрация пользователя
#### body: { FirstName: 'string',
####         MiddleName: 'string',
####         LastName: 'string',
####         userEmail: 'string',
####         userPassword: 'string',
####         birthDate: 'string',
####         userRole : 'integer' (1, 2) } 
### /user/login - авторизация пользователя 
#### body: { userEmail: 'string',
####         userPassword: 'string',} 
### /user/block - блокировка пользователя
#### body: {userId: 'integer'}