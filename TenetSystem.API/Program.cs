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
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("TenetSystem.Infrastructure")));

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

app.MapControllers();

app.Run();