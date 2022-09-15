# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /source

RUN curl -sL https://deb.nodesource.com/setup_18.x |  bash -
RUN apt-get install -y nodejs

COPY . ./
RUN dotnet restore
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /source
COPY --from=build /source/out .
ENTRYPOINT ["dotnet", "permittable.dll"]