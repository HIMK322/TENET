using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TenetSystem.Infrastructure.Services;
using TenetSystem.Infrastructure.Data;
using TenetSystem.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Add database context
builder.Services.AddDbContext<PropertyDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("SqliteConnection"),
        b => b.MigrationsAssembly("TenetSystem.Infrastructure")));

// cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", 
        builder => builder
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Add repositories
builder.Services.AddScoped<BuildingRepository>();
builder.Services.AddScoped<UnitRepository>();
builder.Services.AddScoped<TenantRepository>();
builder.Services.AddScoped<RentReceiptRepository>();
builder.Services.AddScoped<TenantHistoryRepository>();

// Add services
builder.Services.AddScoped<TenetSystemService>();

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();
app.UseCors("AllowFrontend");

app.MapControllers();

// Ensure database is created and migrations are applied
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<PropertyDbContext>();
    dbContext.Database.EnsureCreated();
}

app.Run();