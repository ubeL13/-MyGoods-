using Microsoft.EntityFrameworkCore;
using MyGoods.Api.Middleware;
using MyGoods.Application.Services;
using MyGoods.Core.Repositories;
using MyGoods.Dto.Services;
using MyGoods.Infrastructure.Data;
using MyGoods.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddControllers();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Описания из /// <summary> контроллеров (Api) и DTO (Dto)
    foreach (var xmlPath in Directory.GetFiles(AppContext.BaseDirectory, "MyGoods.*.xml"))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        
        // Запускаем заполнение данных (асинхронно)
        await CategoryDataSeeder.SeedAsync(db);
        await ProductDataSeeder.SeedAsync(db);
    }
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.MapControllers();

await app.RunAsync();