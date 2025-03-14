// 生成图标脚本
const fs = require('fs');
const { createCanvas } = require('canvas');

// 创建图标目录
if (!fs.existsSync('./icons')) {
  fs.mkdirSync('./icons');
}

// 生成不同尺寸的图标
const sizes = [16, 48, 128];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // 清除画布
  ctx.clearRect(0, 0, size, size);
  
  // 设置背景
  ctx.fillStyle = '#4f46e5';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
  ctx.fill();
  
  // 绘制rectangle-ellipsis图标
  ctx.fillStyle = 'white';
  
  // 计算图标大小和位置
  const iconSize = size * 0.6;
  
  // 绘制矩形
  const rectWidth = iconSize * 0.7;
  const rectHeight = iconSize * 0.5;
  const rectX = (size - rectWidth) / 2;
  const rectY = (size - rectHeight) / 2;
  const cornerRadius = size * 0.06;
  
  ctx.beginPath();
  // 使用圆角矩形
  ctx.moveTo(rectX + cornerRadius, rectY);
  ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
  ctx.arcTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + cornerRadius, cornerRadius);
  ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
  ctx.arcTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - cornerRadius, rectY + rectHeight, cornerRadius);
  ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
  ctx.arcTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - cornerRadius, cornerRadius);
  ctx.lineTo(rectX, rectY + cornerRadius);
  ctx.arcTo(rectX, rectY, rectX + cornerRadius, rectY, cornerRadius);
  ctx.closePath();
  ctx.fillStyle = 'white';
  ctx.fill();
  
  // 绘制省略号
  const dotRadius = size * 0.05;
  const dotY = rectY + rectHeight / 2;
  const dotSpacing = rectWidth / 4;
  
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(rectX + i * dotSpacing, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#4f46e5';
    ctx.fill();
  }
  
  // 保存图标
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`./icons/icon${size}.png`, buffer);
  
  console.log(`已生成 ${size}x${size} 图标`);
});

console.log('所有图标已生成完成！');
